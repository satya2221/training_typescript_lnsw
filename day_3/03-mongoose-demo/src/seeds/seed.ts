import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Category } from '../schemas/category.schema';
import { Product } from '../schemas/product.schema';
import { Order } from '../schemas/order.schema';

async function seed() {
  console.log('🌱 Seeding MongoDB database...');

  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel: Model<User> = app.get(getModelToken(User.name));
  const categoryModel: Model<Category> = app.get(getModelToken(Category.name));
  const productModel: Model<Product> = app.get(getModelToken(Product.name));
  const orderModel: Model<Order> = app.get(getModelToken(Order.name));

  try {
    // Clear existing data
    await Promise.all([
      userModel.deleteMany({}),
      categoryModel.deleteMany({}),
      productModel.deleteMany({}),
      orderModel.deleteMany({})
    ]);

    // Create users
    const user1 = await userModel.create({
      email: 'john.mongodb@example.com',
      name: 'John Doe (MongoDB)',
    });

    const user2 = await userModel.create({
      email: 'jane.mongodb@example.com',
      name: 'Jane Smith (MongoDB)',
    });

    // Create categories
    const electronicsCategory = await categoryModel.create({
      name: 'Electronics',
    });

    const laptopsCategory = await categoryModel.create({
      name: 'Laptops',
      parentId: electronicsCategory._id,
    });

    const accessoriesCategory = await categoryModel.create({
      name: 'Accessories',
    });

    // Create products with rich embedded data (showcasing NoSQL advantages)
    const product1 = await productModel.create({
      name: 'ThinkPad X1 Carbon',
      description: 'Business ultrabook with MongoDB flexibility',
      pricing: {
        current: 2199.99,
        original: 2499.99,
        discountPercent: 12,
      },
      inventory: {
        quantity: 12,
        lowStockThreshold: 5,
        status: 'available',
        lastRestocked: new Date(),
      },
      categoryId: laptopsCategory._id,
      tags: ['business', 'ultrabook', 'carbon-fiber', 'premium'],
      metadata: {
        dimensions: {
          length: 323,
          width: 217,
          height: 14.9,
          weight: 1.09
        },
        manufacturer: {
          name: 'Lenovo',
          country: 'China',
          website: 'https://lenovo.com'
        },
        specifications: new Map([
          ['processor', 'Intel Core i7-1165G7'],
          ['memory', '16GB LPDDR4x'],
          ['storage', '512GB SSD'],
          ['display', '14" 1920x1200 IPS'],
          ['battery', '57Wh Li-Polymer'],
          ['ports', 'USB-C, USB-A, HDMI, Audio'],
          ['wireless', 'Wi-Fi 6, Bluetooth 5.1'],
          ['os', 'Windows 11 Pro']
        ])
      }
    });

    const product2 = await productModel.create({
      name: 'MacBook Air M2',
      description: 'Apple silicon laptop showcasing document flexibility',
      pricing: {
        current: 1399.99,
        original: 1399.99,
      },
      inventory: {
        quantity: 5,
        lowStockThreshold: 3,
        status: 'available',
        lastRestocked: new Date(),
      },
      categoryId: laptopsCategory._id,
      tags: ['apple', 'arm-processor', 'fanless', 'lightweight'],
      metadata: {
        dimensions: {
          length: 304,
          width: 215,
          height: 11.3,
          weight: 1.24
        },
        manufacturer: {
          name: 'Apple Inc.',
          country: 'USA',
          website: 'https://apple.com'
        },
        specifications: new Map([
          ['processor', 'Apple M2 8-core'],
          ['memory', '8GB Unified Memory'],
          ['storage', '256GB SSD'],
          ['display', '13.6" 2560x1664 Liquid Retina'],
          ['battery', '52.6Wh Li-Polymer'],
          ['ports', 'USB-C x2, MagSafe 3'],
          ['wireless', 'Wi-Fi 6, Bluetooth 5.0'],
          ['os', 'macOS Ventura']
        ])
      }
    });

    const product3 = await productModel.create({
      name: 'USB-C Hub',
      description: 'Multi-port hub (MongoDB document demo)',
      pricing: {
        current: 79.99,
        original: 99.99,
        discountPercent: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      inventory: {
        quantity: 2, // Low stock for testing
        lowStockThreshold: 5,
        status: 'available',
        lastRestocked: new Date(),
      },
      categoryId: accessoriesCategory._id,
      tags: ['usb-c', 'hub', 'connectivity', 'portable'],
      metadata: {
        dimensions: {
          length: 120,
          width: 45,
          height: 15,
          weight: 0.18
        },
        manufacturer: {
          name: 'Anker',
          country: 'China',
          website: 'https://anker.com'
        },
        specifications: new Map([
          ['ports', 'USB-C x1, USB-A x2, HDMI x1, SD x1'],
          ['power_delivery', '100W Pass-through'],
          ['hdmi_resolution', '4K@60Hz'],
          ['material', 'Aluminum alloy'],
          ['compatibility', 'MacBook, iPad, Windows laptops']
        ])
      }
    });

    // Create order with embedded items (denormalized approach typical in NoSQL)
    await orderModel.create({
      userId: user1._id,
      items: [
        {
          productId: product1._id,
          productName: product1.name,
          quantity: 1,
          unitPrice: product1.pricing.current,
          totalPrice: product1.pricing.current * 1,
          productSnapshot: {
            description: product1.description,
            categoryName: 'Laptops',
            tags: product1.tags
          }
        },
        {
          productId: product3._id,
          productName: product3.name,
          quantity: 1,
          unitPrice: product3.pricing.current,
          totalPrice: product3.pricing.current * 1,
          productSnapshot: {
            description: product3.description,
            categoryName: 'Accessories',
            tags: product3.tags
          }
        }
      ],
      total: product1.pricing.current + product3.pricing.current,
      status: 'DELIVERED',
      shippingAddress: {
        street: '123 MongoDB Street',
        city: 'Document City',
        state: 'NoSQL State',
        zipCode: '12345',
        country: 'JSON Kingdom'
      },
      metadata: {
        payment: {
          method: 'credit_card',
          transactionId: 'tx_mongo_123456',
          paidAt: new Date()
        },
        shipping: {
          method: 'standard',
          trackingNumber: 'MONGO123456789',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        notes: 'MongoDB demo order showcasing embedded documents and denormalization'
      }
    });

    console.log('✅ MongoDB database seeded successfully!');
    console.log('📊 Created:');
    console.log(`  - ${2} users`);
    console.log(`  - ${3} categories (with hierarchy)`);
    console.log(`  - ${3} products (with rich embedded metadata)`);
    console.log(`  - ${1} orders (with embedded items and denormalized data)`);

  } catch (error) {
    console.error('❌ Error seeding MongoDB database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});