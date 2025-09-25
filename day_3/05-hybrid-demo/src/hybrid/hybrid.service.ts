import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Review, ReviewDocument } from '../schemas/review.schema';

@Injectable()
export class HybridService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Product.name, 'mongodb')
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Review.name, 'mongodb')
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  // Cross-database operations
  async getOrderWithProducts(orderId: number) {
    // Get order from PostgreSQL
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: true,
        payments: true,
      },
    });

    if (!order) {
      return null;
    }

    // Get product details from MongoDB
    const productIds = order.orderItems.map(item => item.productId);
    const products = await this.productModel.find({
      _id: { $in: productIds }
    }).exec();

    // Combine data
    const orderWithProducts = {
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        product: products.find(p => (p._id as any).toString() === item.productId),
      })),
    };

    return orderWithProducts;
  }

  // Get product with reviews and order statistics
  async getProductDetails(productId: string) {
    // Get product from MongoDB
    const product = await this.productModel.findById(productId).exec();
    
    if (!product) {
      return null;
    }

    // Get reviews from MongoDB
    const reviews = await this.reviewModel
      .find({ productId, status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    // Get order statistics from PostgreSQL
    const orderStats = await this.prisma.orderItem.aggregate({
      where: { productId },
      _sum: { quantity: true },
      _count: { id: true },
    });

    return {
      product,
      reviews,
      orderStats: {
        totalSold: orderStats._sum.quantity || 0,
        totalOrders: orderStats._count.id || 0,
      },
    };
  }

  // Create order with product validation
  async createOrder(userId: number, items: Array<{ productId: string; quantity: number }>) {
    // Validate products exist in MongoDB
    const productIds = items.map(item => item.productId);
    const products = await this.productModel.find({
      _id: { $in: productIds }
    }).exec();

    if (products.length !== items.length) {
      throw new Error('Some products not found');
    }

    // Check inventory
    for (const item of items) {
      const product = products.find(p => (p._id as any).toString() === item.productId);
      if (!product || product.inventory.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for product ${item.productId}`);
      }
    }

    // Create order in PostgreSQL with transaction
    return this.prisma.$transaction(async (prisma) => {
      // Generate order number
      const orderNumber = `HYB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate total
      let totalAmount = 0;
      const orderItemsData = items.map(item => {
        const product = products.find(p => (p._id as any).toString() === item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        const unitPrice = product.pricing.currentPrice;
        const total = unitPrice * item.quantity;
        totalAmount += total;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          total,
          productName: product.name,
          productDescription: product.shortDescription || '',
        };
      });

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          status: 'PENDING',
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
          user: true,
        },
      });

      // Update inventory in MongoDB (outside transaction)
      for (const item of items) {
        await this.productModel.updateOne(
          { _id: item.productId },
          { 
            $inc: { 
              'inventory.quantity': -item.quantity,
              purchaseCount: item.quantity,
            }
          }
        );
      }

      return order;
    });
  }

  // Get user dashboard with cross-database data
  async getUserDashboard(userId: number) {
    // Get user and orders from PostgreSQL
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            orderItems: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return null;
    }

    // Get product details for recent orders
    const recentProductIds = user.orders
      .flatMap(order => order.orderItems.map(item => item.productId))
      .slice(0, 10);

    const recentProducts = await this.productModel
      .find({ _id: { $in: recentProductIds } })
      .exec();

    // Get user's reviews from MongoDB
    const userReviews = await this.reviewModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    return {
      user,
      recentProducts,
      userReviews,
      orderSummary: {
        totalOrders: user.orders.length,
        totalSpent: user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
      },
    };
  }

  // Search products with filters
  async searchProducts(query: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const filter: any = { status: 'active' };

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.category) {
      filter.categoryName = new RegExp(query.category, 'i');
    }

    if (query.minPrice || query.maxPrice) {
      filter['pricing.currentPrice'] = {};
      if (query.minPrice) filter['pricing.currentPrice'].$gte = query.minPrice;
      if (query.maxPrice) filter['pricing.currentPrice'].$lte = query.maxPrice;
    }

    if (query.inStock) {
      filter['inventory.quantity'] = { $gt: 0 };
    }

    const products = await this.productModel
      .find(filter)
      .limit(query.limit || 20)
      .skip(query.offset || 0)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.productModel.countDocuments(filter);

    return {
      products,
      total,
      hasMore: (query.offset || 0) + products.length < total,
    };
  }
}