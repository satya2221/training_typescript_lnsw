import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product, ProductStatus } from '../entities/product.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

async function seed() {
  console.log('🌱 Seeding Mikro-ORM database...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const em = app.get(EntityManager).fork();

  try {
    // Create schema first (using raw SQL for simplicity)
    try {
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS mikroorm_demo.users (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          version INT NOT NULL DEFAULT 1,
          deleted_at TIMESTAMPTZ NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NULL,
          address TEXT NULL,
          preferences JSONB NULL
        );
        
        CREATE TABLE IF NOT EXISTS mikroorm_demo.categories (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          version INT NOT NULL DEFAULT 1,
          deleted_at TIMESTAMPTZ NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT NULL,
          parent_id INT NULL REFERENCES mikroorm_demo.categories(id)
        );
        
        CREATE TABLE IF NOT EXISTS mikroorm_demo.products (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          version INT NOT NULL DEFAULT 1,
          deleted_at TIMESTAMPTZ NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT NULL,
          price DECIMAL(10,2) NOT NULL,
          quantity INT NOT NULL DEFAULT 0,
          sku VARCHAR(255) NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          category_id INT NOT NULL REFERENCES mikroorm_demo.categories(id),
          tags TEXT[] NULL,
          attributes JSONB NULL
        );
        
        CREATE TABLE IF NOT EXISTS mikroorm_demo.orders (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          version INT NOT NULL DEFAULT 1,
          deleted_at TIMESTAMPTZ NULL,
          order_number VARCHAR(255) NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
          shipping_address TEXT NULL,
          notes TEXT NULL,
          metadata JSONB NULL,
          user_id INT NOT NULL REFERENCES mikroorm_demo.users(id)
        );
        
        CREATE TABLE IF NOT EXISTS mikroorm_demo.order_items (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          version INT NOT NULL DEFAULT 1,
          deleted_at TIMESTAMPTZ NULL,
          quantity INT NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          order_id INT NOT NULL REFERENCES mikroorm_demo.orders(id),
          product_id INT NOT NULL REFERENCES mikroorm_demo.products(id)
        );
      `);
      console.log('✅ Database schema created');
    } catch (error) {
      console.log('⚠️ Schema might already exist, continuing...');
    }

    // Clear existing data
    await em.nativeDelete(OrderItem, {});
    await em.nativeDelete(Order, {});
    await em.nativeDelete(Product, {});
    await em.nativeDelete(Category, {});
    await em.nativeDelete(User, {});

    // Create users
    const user1 = new User();
    user1.email = 'john.mikroorm@example.com';
    user1.name = 'John Doe (Mikro-ORM)';
    user1.phone = '+1-555-0101';
    user1.address = '123 Mikro Street, ORM City, DB 12345';
    user1.preferences = {
      newsletter: true,
      notifications: true,
      theme: 'dark',
      language: 'en',
    };

    const user2 = new User();
    user2.email = 'jane.mikroorm@example.com';
    user2.name = 'Jane Smith (Mikro-ORM)';
    user2.phone = '+1-555-0102';
    user2.address = '456 Unit Avenue, Work City, DB 67890';
    user2.preferences = {
      newsletter: false,
      notifications: true,
      theme: 'light',
      language: 'en',
    };

    em.persist([user1, user2]);

    // Create categories with hierarchy
    const electronicsCategory = new Category();
    electronicsCategory.name = 'Electronics';
    electronicsCategory.description = 'Electronic devices and gadgets';

    const laptopsCategory = new Category();
    laptopsCategory.name = 'Laptops';
    laptopsCategory.description = 'Portable computers';
    laptopsCategory.parent = electronicsCategory;

    const accessoriesCategory = new Category();
    accessoriesCategory.name = 'Accessories';
    accessoriesCategory.description = 'Computer accessories and peripherals';

    em.persist([electronicsCategory, laptopsCategory, accessoriesCategory]);

    // Flush to get IDs
    await em.flush();

    // Create products with advanced features
    const product1 = new Product();
    product1.name = 'ThinkPad X1 Carbon (Mikro-ORM)';
    product1.description = 'Business ultrabook showcasing Mikro-ORM advanced features';
    product1.price = 2299.99;
    product1.quantity = 15;
    product1.sku = 'MIKROORM-TP-X1C';
    product1.status = ProductStatus.ACTIVE;
    product1.category = laptopsCategory;
    product1.tags = ['business', 'ultrabook', 'premium', 'mikroorm'];
    product1.attributes = {
      weight: 1.09,
      dimensions: {
        length: 323,
        width: 217,
        height: 14.9,
      },
      color: 'Carbon Black',
      material: 'Carbon Fiber',
      warranty: '3 years',
      processor: 'Intel Core i7-1165G7',
      memory: '16GB LPDDR4x',
      storage: '512GB SSD',
    };

    const product2 = new Product();
    product2.name = 'MacBook Pro M3 (Mikro-ORM)';
    product2.description = 'Apple silicon laptop with Mikro-ORM Identity Map';
    product2.price = 1999.99;
    product2.quantity = 8;
    product2.sku = 'MIKROORM-MBP-M3';
    product2.status = ProductStatus.ACTIVE;
    product2.category = laptopsCategory;
    product2.tags = ['apple', 'arm-processor', 'creative', 'mikroorm'];
    product2.attributes = {
      weight: 1.6,
      dimensions: {
        length: 312,
        width: 221,
        height: 15.5,
      },
      color: 'Space Gray',
      material: 'Aluminum',
      warranty: '1 year',
      processor: 'Apple M3 Pro',
      memory: '18GB Unified Memory',
      storage: '512GB SSD',
    };

    const product3 = new Product();
    product3.name = 'USB-C Hub Pro (Mikro-ORM)';
    product3.description = 'Multi-port hub demonstrating Unit of Work';
    product3.price = 89.99;
    product3.quantity = 3; // Low stock for testing
    product3.sku = 'MIKROORM-HUB-USBC';
    product3.status = ProductStatus.ACTIVE;
    product3.category = accessoriesCategory;
    product3.tags = ['usb-c', 'hub', 'connectivity', 'mikroorm'];
    product3.attributes = {
      weight: 0.2,
      dimensions: {
        length: 120,
        width: 45,
        height: 15,
      },
      color: 'Space Gray',
      material: 'Aluminum',
      warranty: '2 years',
      ports: 'USB-C x2, USB-A x3, HDMI x1, SD x1',
      power_delivery: '100W Pass-through',
    };

    em.persist([product1, product2, product3]);

    // Create orders to demonstrate transactions
    const order1 = new Order();
    order1.user = user1;
    order1.status = OrderStatus.CONFIRMED;
    order1.shippingAddress = user1.address;
    order1.notes = 'Demonstrating Mikro-ORM Unit of Work pattern';
    order1.generateOrderNumber();
    order1.metadata = {
      paymentMethod: 'Credit Card',
      discountCode: 'MIKROORM10',
      discountAmount: 50.00,
    };

    const orderItem1 = new OrderItem();
    orderItem1.order = order1;
    orderItem1.product = product1;
    orderItem1.quantity = 1;
    orderItem1.unitPrice = product1.price;

    const orderItem2 = new OrderItem();
    orderItem2.order = order1;
    orderItem2.product = product3;
    orderItem2.quantity = 2;
    orderItem2.unitPrice = product3.price;

    order1.addItem(orderItem1);
    order1.addItem(orderItem2);
    await order1.updateTotal();

    em.persist([order1, orderItem1, orderItem2]);

    // Flush all changes using Unit of Work
    await em.flush();

    console.log('✅ Seed data created successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${await em.count(User)} users`);
    console.log(`   - ${await em.count(Category)} categories`);
    console.log(`   - ${await em.count(Product)} products`);
    console.log(`   - ${await em.count(Order)} orders`);
    console.log(`   - ${await em.count(OrderItem)} order items`);

    console.log('\n🎯 Advanced Features Demonstrated:');
    console.log('   ✓ Unit of Work pattern');
    console.log('   ✓ Identity Map (same entity instances)');
    console.log('   ✓ Optimistic locking (version field)');
    console.log('   ✓ Soft deletes (deletedAt field)');
    console.log('   ✓ JSON attributes (flexible metadata)');
    console.log('   ✓ Array fields (tags)');
    console.log('   ✓ Hierarchical relationships (categories)');
    console.log('   ✓ Complex business logic in entities');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seed script failed:', error);
  process.exit(1);
});