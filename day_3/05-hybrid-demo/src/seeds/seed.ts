import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Review, ReviewDocument } from '../schemas/review.schema';

async function seed() {
  console.log('🌱 Starting hybrid demo seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name, 'mongodb'));
  const reviewModel = app.get<Model<ReviewDocument>>(getModelToken(Review.name, 'mongodb'));

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await reviewModel.deleteMany({});
    await productModel.deleteMany({});

    // Seed PostgreSQL data (Users, Orders)
    console.log('📊 Seeding PostgreSQL data...');
    
    // Create users
    const users = await prisma.user.createMany({
      data: [
        {
          email: 'john.doe@example.com',
          name: 'John Doe',
          phone: '+1-555-0101',
          address: '123 Main St, New York, NY 10001',
        },
        {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          phone: '+1-555-0102',
          address: '456 Oak Ave, Los Angeles, CA 90210',
        },
        {
          email: 'bob.wilson@example.com',
          name: 'Bob Wilson',
          phone: '+1-555-0103',
          address: '789 Pine Rd, Chicago, IL 60601',
        },
      ],
    });

    const createdUsers = await prisma.user.findMany();
    console.log(`✅ Created ${createdUsers.length} users`);

    // Seed MongoDB data (Products)
    console.log('🍃 Seeding MongoDB data...');
    
    const products = await productModel.insertMany([
      {
        name: 'ThinkPad X1 Carbon (Hybrid)',
        description: 'Business ultrabook with hybrid database architecture demonstration',
        shortDescription: 'Premium business laptop',
        sku: 'HYBRID-TP-X1C',
        status: 'active',
        categoryName: 'Laptops',
        brand: 'Lenovo',
        manufacturer: 'Lenovo Group',
        pricing: {
          basePrice: 2499.99,
          currentPrice: 2299.99,
          discountPercentage: 8,
          currency: 'USD',
        },
        inventory: {
          quantity: 15,
          lowStockThreshold: 5,
          trackQuantity: true,
          allowBackorder: false,
        },
        dimensions: {
          length: 32.3,
          width: 21.7,
          height: 1.49,
          weight: 1.09,
        },
        images: [
          'https://example.com/thinkpad-x1-1.jpg',
          'https://example.com/thinkpad-x1-2.jpg',
        ],
        attributes: new Map([
          ['processor', 'Intel Core i7-1165G7'],
          ['memory', '16GB LPDDR4x'],
          ['storage', '512GB SSD'],
          ['display', '14" FHD IPS'],
          ['color', 'Carbon Black'],
          ['warranty', '3 years'],
        ]),
        tags: ['business', 'ultrabook', 'premium', 'hybrid'],
        seo: {
          metaTitle: 'ThinkPad X1 Carbon - Premium Business Laptop',
          metaDescription: 'Experience the ultimate business laptop with hybrid database demo',
          keywords: ['thinkpad', 'business', 'laptop', 'ultrabook'],
          slug: 'thinkpad-x1-carbon-hybrid',
        },
      },
      {
        name: 'MacBook Pro M3 (Hybrid)',
        description: 'Apple silicon laptop demonstrating cross-database operations',
        shortDescription: 'Professional creative laptop',
        sku: 'HYBRID-MBP-M3',
        status: 'active',
        categoryName: 'Laptops',
        brand: 'Apple',
        manufacturer: 'Apple Inc.',
        pricing: {
          basePrice: 2199.99,
          currentPrice: 1999.99,
          discountPercentage: 9,
          currency: 'USD',
        },
        inventory: {
          quantity: 8,
          lowStockThreshold: 3,
          trackQuantity: true,
          allowBackorder: true,
        },
        dimensions: {
          length: 31.2,
          width: 22.1,
          height: 1.55,
          weight: 1.6,
        },
        images: [
          'https://example.com/macbook-pro-1.jpg',
          'https://example.com/macbook-pro-2.jpg',
        ],
        attributes: new Map([
          ['processor', 'Apple M3 Pro'],
          ['memory', '18GB Unified Memory'],
          ['storage', '512GB SSD'],
          ['display', '14.2" Liquid Retina XDR'],
          ['color', 'Space Gray'],
          ['warranty', '1 year'],
        ]),
        tags: ['apple', 'creative', 'arm-processor', 'hybrid'],
        seo: {
          metaTitle: 'MacBook Pro M3 - Professional Creative Laptop',
          metaDescription: 'Unleash your creativity with Apple M3 Pro chip',
          keywords: ['macbook', 'apple', 'm3', 'creative'],
          slug: 'macbook-pro-m3-hybrid',
        },
      },
      {
        name: 'USB-C Hub Pro (Hybrid)',
        description: 'Multi-port hub showcasing flexible MongoDB schema',
        shortDescription: 'Professional connectivity hub',
        sku: 'HYBRID-HUB-USBC',
        status: 'active',
        categoryName: 'Accessories',
        brand: 'HybridTech',
        manufacturer: 'HybridTech Solutions',
        pricing: {
          basePrice: 99.99,
          currentPrice: 89.99,
          discountPercentage: 10,
          currency: 'USD',
        },
        inventory: {
          quantity: 25,
          lowStockThreshold: 10,
          trackQuantity: true,
          allowBackorder: true,
        },
        dimensions: {
          length: 12.0,
          width: 4.5,
          height: 1.5,
          weight: 0.2,
        },
        images: [
          'https://example.com/usb-hub-1.jpg',
        ],
        attributes: new Map([
          ['ports', 'USB-C x2, USB-A x3, HDMI x1, SD x1'],
          ['power_delivery', '100W Pass-through'],
          ['material', 'Aluminum'],
          ['color', 'Space Gray'],
          ['warranty', '2 years'],
        ]),
        tags: ['usb-c', 'hub', 'connectivity', 'hybrid'],
        seo: {
          metaTitle: 'USB-C Hub Pro - Professional Connectivity',
          metaDescription: 'Expand your connectivity with professional USB-C hub',
          keywords: ['usb-c', 'hub', 'connectivity', 'ports'],
          slug: 'usb-c-hub-pro-hybrid',
        },
      },
    ]);

    console.log(`✅ Created ${products.length} products in MongoDB`);

    // Create orders with cross-database references
    console.log('🔗 Creating cross-database orders...');
    
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'HYB-2024-001',
        userId: createdUsers[0].id,
        totalAmount: 2389.98,
        status: 'CONFIRMED',
        shippingAddress: '123 Main St, New York, NY 10001',
        shippingCost: 0,
        orderItems: {
          create: [
            {
              productId: (products[0]._id as any).toString(),
              quantity: 1,
              unitPrice: 2299.99,
              total: 2299.99,
              productName: 'ThinkPad X1 Carbon (Hybrid)',
              productDescription: 'Premium business laptop',
            },
            {
              productId: (products[2]._id as any).toString(),
              quantity: 1,
              unitPrice: 89.99,
              total: 89.99,
              productName: 'USB-C Hub Pro (Hybrid)',
              productDescription: 'Professional connectivity hub',
            },
          ],
        },
        payments: {
          create: {
            amount: 2389.98,
            method: 'CREDIT_CARD',
            status: 'COMPLETED',
            transactionId: 'txn_hybrid_001',
            paidAt: new Date(),
          },
        },
      },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'HYB-2024-002',
        userId: createdUsers[1].id,
        totalAmount: 1999.99,
        status: 'PROCESSING',
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
        shippingCost: 15.99,
        orderItems: {
          create: {
            productId: (products[1]._id as any).toString(),
            quantity: 1,
            unitPrice: 1999.99,
            total: 1999.99,
            productName: 'MacBook Pro M3 (Hybrid)',
            productDescription: 'Professional creative laptop',
          },
        },
        payments: {
          create: {
            amount: 1999.99,
            method: 'PAYPAL',
            status: 'PROCESSING',
            transactionId: 'txn_hybrid_002',
          },
        },
      },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    console.log(`✅ Created 2 orders with cross-database references`);

    // Create reviews in MongoDB
    console.log('⭐ Creating product reviews...');
    
    const reviews = await reviewModel.insertMany([
      {
        productId: (products[0]._id as any).toString(),
        userId: createdUsers[0].id,
        orderId: order1.id,
        isVerifiedPurchase: true,
        rating: 5,
        title: 'Excellent business laptop!',
        content: 'This ThinkPad X1 Carbon is perfect for business use. The hybrid database demo works flawlessly!',
        reviewerName: 'John Doe',
        reviewerEmail: 'john.doe@example.com',
        status: 'approved',
        pros: ['Lightweight', 'Great keyboard', 'Excellent build quality'],
        cons: ['Price is high'],
        helpfulness: {
          helpfulCount: 5,
          notHelpfulCount: 0,
          helpfulVoters: ['user1', 'user2', 'user3'],
          notHelpfulVoters: [],
        },
        productName: 'ThinkPad X1 Carbon (Hybrid)',
        productSku: 'HYBRID-TP-X1C',
        purchaseDate: new Date(),
        purchasePrice: 2299.99,
        reviewSource: 'website',
      },
      {
        productId: (products[1]._id as any).toString(),
        userId: createdUsers[1].id,
        orderId: order2.id,
        isVerifiedPurchase: true,
        rating: 4,
        title: 'Great for creative work',
        content: 'The M3 chip is incredibly fast for video editing. Cross-database operations are smooth.',
        reviewerName: 'Jane Smith',
        reviewerEmail: 'jane.smith@example.com',
        status: 'approved',
        pros: ['Fast M3 chip', 'Beautiful display', 'Great for creative work'],
        cons: ['Limited ports', 'Expensive'],
        helpfulness: {
          helpfulCount: 3,
          notHelpfulCount: 1,
          helpfulVoters: ['user4', 'user5'],
          notHelpfulVoters: ['user6'],
        },
        responses: [
          {
            message: 'Thank you for your review! We appreciate your feedback.',
            respondedBy: 'Apple Support',
            respondedAt: new Date(),
            isOfficial: true,
          },
        ],
        productName: 'MacBook Pro M3 (Hybrid)',
        productSku: 'HYBRID-MBP-M3',
        purchaseDate: new Date(),
        purchasePrice: 1999.99,
        reviewSource: 'website',
      },
    ]);

    console.log(`✅ Created ${reviews.length} reviews`);

    // Update product statistics
    console.log('📈 Updating product statistics...');
    
    await productModel.updateOne(
      { _id: products[0]._id },
      { 
        $inc: { 
          purchaseCount: 1,
          viewCount: 25,
        },
        $set: {
          averageRating: 5.0,
          reviewCount: 1,
        }
      }
    );

    await productModel.updateOne(
      { _id: products[1]._id },
      { 
        $inc: { 
          purchaseCount: 1,
          viewCount: 18,
        },
        $set: {
          averageRating: 4.0,
          reviewCount: 1,
        }
      }
    );

    await productModel.updateOne(
      { _id: products[2]._id },
      { 
        $inc: { 
          purchaseCount: 1,
          viewCount: 12,
        }
      }
    );

    console.log('✅ Updated product statistics');

    console.log('\n🎉 Hybrid demo seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   PostgreSQL: ${createdUsers.length} users, 2 orders, 3 order items, 2 payments`);
    console.log(`   MongoDB: ${products.length} products, ${reviews.length} reviews`);
    console.log('\n🔗 Cross-database references established');
    console.log('🧪 Ready for testing hybrid operations!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });