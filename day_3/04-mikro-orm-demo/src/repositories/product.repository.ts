import { EntityRepository } from '@mikro-orm/core';
import { Product, ProductStatus } from '../entities/product.entity';

export class ProductRepository extends EntityRepository<Product> {
  
  // Find product with category populated
  async findWithCategory(id: number): Promise<Product | null> {
    return this.findOne(
      { id },
      { 
        populate: ['category'],
        cache: 60000, // Cache for 1 minute
      }
    );
  }

  // Find products by filters
  async findByFilters(filters: {
    categoryId?: number;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
  }): Promise<Product[]> {
    const where: any = {};

    if (filters.categoryId) {
      where.category = filters.categoryId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.$lte = filters.maxPrice;
      }
    }

    if (filters.inStock) {
      where.quantity = { $gt: 0 };
    }

    if (filters.search) {
      where.$or = [
        { name: { $ilike: `%${filters.search}%` } },
        { description: { $ilike: `%${filters.search}%` } },
        { sku: { $ilike: `%${filters.search}%` } },
      ];
    }

    return this.find(where, { populate: ['category'] });
  }

  // Find low stock products with pagination
  async findLowStockProducts(
    threshold: number = 10,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    const [products, total] = await this.findAndCount(
      {
        quantity: { $lte: threshold, $gt: 0 },
        status: ProductStatus.ACTIVE,
      },
      {
        populate: ['category'],
        orderBy: { quantity: 'ASC' },
        limit,
        offset,
      }
    );

    return { products, total };
  }

  // Search products by text
  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    return this.find(
      {
        $or: [
          { name: { $ilike: `%${query}%` } },
          { description: { $ilike: `%${query}%` } },
          { sku: { $ilike: `%${query}%` } },
        ],
      },
      {
        populate: ['category'],
        limit,
        orderBy: { name: 'ASC' },
      }
    );
  }

  // Get products by category
  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.find(
      { category: categoryId },
      { populate: ['category'] }
    );
  }

  // Get active products only
  async findActiveProducts(): Promise<Product[]> {
    return this.find(
      { status: ProductStatus.ACTIVE },
      { populate: ['category'] }
    );
  }

  // Update stock with optimistic locking
  async updateStockWithLocking(
    productId: number,
    quantityChange: number,
    expectedVersion: number
  ): Promise<Product> {
    const product = await this.findOneOrFail(
      { id: productId, version: expectedVersion },
      { populate: ['category'] }
    );

    if (product.quantity + quantityChange < 0) {
      throw new Error('Insufficient stock');
    }

    product.quantity += quantityChange;
    await this.em.flush();

    return product;
  }

  // Get products with low stock
  async getLowStockCount(threshold: number = 10): Promise<number> {
    return this.count({
      quantity: { $lte: threshold, $gt: 0 },
      status: ProductStatus.ACTIVE,
    });
  }

  // Get total value of inventory
  async getTotalInventoryValue(): Promise<number> {
    const products = await this.find({ status: ProductStatus.ACTIVE });
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }
}