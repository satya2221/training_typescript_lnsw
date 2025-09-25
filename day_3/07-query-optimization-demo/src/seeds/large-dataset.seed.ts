import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

// Configuration for the seed
const SEED_CONFIG = {
  USERS: 1000,      // Reduced for testing
  CATEGORIES: 50,
  PRODUCTS: 2000,   // Reduced for testing
  ORDERS: 5000,     // Reduced for testing
  ORDER_ITEMS_PER_ORDER: 4, // Average items per order
  BATCH_SIZE: 100   // Smaller batch size for testing
};

class LargeDatasetSeeder {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'inventory',
      entities: [User, Category, Product, Order, OrderItem],
      synchronize: false,
      logging: false
    });
  }

  async initialize() {
    console.log('🔌 Initializing database connection...');
    await this.dataSource.initialize();
    console.log('✅ Database connected successfully');
  }

  async destroy() {
    await this.dataSource.destroy();
    console.log('🔌 Database connection closed');
  }

  async clearExistingData() {
    console.log('🧹 Clearing existing data...');

    // Clear in reverse order due to foreign key constraints
    await this.dataSource.query('TRUNCATE TABLE order_items CASCADE');
    await this.dataSource.query('TRUNCATE TABLE orders CASCADE');
    await this.dataSource.query('TRUNCATE TABLE products CASCADE');
    await this.dataSource.query('TRUNCATE TABLE categories CASCADE');
    await this.dataSource.query('TRUNCATE TABLE users CASCADE');

    // Reset sequences
    await this.dataSource.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await this.dataSource.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await this.dataSource.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await this.dataSource.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await this.dataSource.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');

    console.log('✅ Existing data cleared');
  }

  async seedUsers() {
    console.log(`👥 Seeding ${SEED_CONFIG.USERS.toLocaleString()} users...`);
    const userRepository = this.dataSource.getRepository(User);

    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let batch = 0; batch < SEED_CONFIG.USERS / SEED_CONFIG.BATCH_SIZE; batch++) {
      const users: User[] = [];

      for (let i = 0; i < SEED_CONFIG.BATCH_SIZE; i++) {
        const userIndex = batch * SEED_CONFIG.BATCH_SIZE + i;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];

        const user = new User();
        user.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${userIndex}@${domain}`;
        user.name = `${firstName} ${lastName}`;
        users.push(user);
      }

      await userRepository.save(users);

      if (batch % 10 === 0) {
        console.log(`   📈 Progress: ${((batch + 1) * SEED_CONFIG.BATCH_SIZE).toLocaleString()}/${SEED_CONFIG.USERS.toLocaleString()} users`);
      }
    }
    console.log('✅ Users seeded successfully');
  }

  async seedCategories() {
    console.log(`📂 Seeding ${SEED_CONFIG.CATEGORIES} categories...`);
    const categoryRepository = this.dataSource.getRepository(Category);

    const categoryNames = [
      'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
      'Toys', 'Automotive', 'Health', 'Beauty', 'Tools',
      'Computers', 'Phones', 'Cameras', 'Gaming', 'Music',
      'Movies', 'Kitchen', 'Furniture', 'Jewelry', 'Shoes',
      'Watches', 'Bags', 'Outdoors', 'Office', 'Art',
      'Baby', 'Pet Supplies', 'Food', 'Beverages', 'Vitamins',
      'Software', 'Industrial', 'Scientific', 'Travel', 'Crafts',
      'Collectibles', 'Antiques', 'Real Estate', 'Services', 'Digital',
      'Luxury', 'Eco-Friendly', 'Handmade', 'Vintage', 'Premium',
      'Budget', 'Professional', 'Consumer', 'Commercial', 'Specialty'
    ];

    const categories: Category[] = [];
    for (let i = 0; i < SEED_CONFIG.CATEGORIES; i++) {
      const category = new Category();
      category.name = categoryNames[i];
      // Some categories have parent categories for hierarchy
      if (i > 10 && Math.random() < 0.3) {
        category.parentId = Math.floor(Math.random() * 10) + 1;
      }
      categories.push(category);
    }

    await categoryRepository.save(categories);
    console.log('✅ Categories seeded successfully');
  }

  async seedProducts() {
    console.log(`📦 Seeding ${SEED_CONFIG.PRODUCTS.toLocaleString()} products...`);
    const productRepository = this.dataSource.getRepository(Product);

    const productPrefixes = [
      'Premium', 'Ultra', 'Pro', 'Super', 'Mega', 'Deluxe', 'Classic', 'Modern',
      'Advanced', 'Professional', 'Elite', 'Ultimate', 'Standard', 'Basic', 'Eco',
      'Smart', 'Digital', 'Wireless', 'Portable', 'Compact', 'Heavy-duty', 'Lightweight'
    ];

    const productTypes = [
      'Laptop', 'Phone', 'Headphones', 'Speaker', 'Monitor', 'Keyboard', 'Mouse',
      'Tablet', 'Camera', 'Watch', 'Charger', 'Cable', 'Case', 'Stand', 'Adapter',
      'Drive', 'Memory', 'Processor', 'Graphics', 'Motherboard', 'Power Supply',
      'Cooler', 'Chair', 'Desk', 'Lamp', 'Backpack', 'Wallet', 'Sunglasses',
      'Jacket', 'Shoes', 'Hat', 'Gloves', 'Belt', 'Shirt', 'Pants', 'Dress'
    ];

    for (let batch = 0; batch < SEED_CONFIG.PRODUCTS / SEED_CONFIG.BATCH_SIZE; batch++) {
      const products: Product[] = [];

      for (let i = 0; i < SEED_CONFIG.BATCH_SIZE; i++) {
        const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
        const type = productTypes[Math.floor(Math.random() * productTypes.length)];
        const productIndex = batch * SEED_CONFIG.BATCH_SIZE + i;

        const product = new Product();
        product.name = `${prefix} ${type} ${String(productIndex).padStart(6, '0')}`;
        product.description = `High-quality ${type.toLowerCase()} with advanced features and excellent performance. Perfect for both professional and personal use.`;
        product.price = parseFloat((Math.random() * 2000 + 10).toFixed(2));
        product.quantity = Math.floor(Math.random() * 1000);
        product.categoryId = Math.floor(Math.random() * SEED_CONFIG.CATEGORIES) + 1;
        products.push(product);
      }

      await productRepository.save(products);

      if (batch % 20 === 0) {
        console.log(`   📈 Progress: ${((batch + 1) * SEED_CONFIG.BATCH_SIZE).toLocaleString()}/${SEED_CONFIG.PRODUCTS.toLocaleString()} products`);
      }
    }
    console.log('✅ Products seeded successfully');
  }

  async seedOrders() {
    console.log(`🛒 Seeding ${SEED_CONFIG.ORDERS.toLocaleString()} orders...`);
    const orderRepository = this.dataSource.getRepository(Order);

    const statuses = [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED];

    for (let batch = 0; batch < SEED_CONFIG.ORDERS / SEED_CONFIG.BATCH_SIZE; batch++) {
      const orders: Order[] = [];

      for (let i = 0; i < SEED_CONFIG.BATCH_SIZE; i++) {
        const order = new Order();
        order.userId = Math.floor(Math.random() * SEED_CONFIG.USERS) + 1;
        order.status = statuses[Math.floor(Math.random() * statuses.length)];

        // Will be calculated after order items are created
        order.total = 0;
        orders.push(order);
      }

      await orderRepository.save(orders);

      if (batch % 50 === 0) {
        console.log(`   📈 Progress: ${((batch + 1) * SEED_CONFIG.BATCH_SIZE).toLocaleString()}/${SEED_CONFIG.ORDERS.toLocaleString()} orders`);
      }
    }
    console.log('✅ Orders seeded successfully');
  }

  async seedOrderItems() {
    const expectedOrderItems = SEED_CONFIG.ORDERS * SEED_CONFIG.ORDER_ITEMS_PER_ORDER;
    console.log(`📋 Seeding ~${expectedOrderItems.toLocaleString()} order items...`);

    const orderItemRepository = this.dataSource.getRepository(OrderItem);
    const orderRepository = this.dataSource.getRepository(Order);

    let totalOrderItems = 0;

    for (let orderId = 1; orderId <= SEED_CONFIG.ORDERS; orderId++) {
      // Random number of items per order (1-8 items)
      const itemsCount = Math.floor(Math.random() * 8) + 1;
      const orderItems: OrderItem[] = [];
      let orderTotal = 0;

      for (let i = 0; i < itemsCount; i++) {
        const orderItem = new OrderItem();
        orderItem.orderId = orderId;
        orderItem.productId = Math.floor(Math.random() * SEED_CONFIG.PRODUCTS) + 1;
        orderItem.quantity = Math.floor(Math.random() * 5) + 1;
        orderItem.unitPrice = parseFloat((Math.random() * 500 + 5).toFixed(2));

        orderTotal += orderItem.quantity * parseFloat(orderItem.unitPrice.toString());
        orderItems.push(orderItem);
      }

      // Save order items in batches
      await orderItemRepository.save(orderItems);

      // Update order total
      await orderRepository.update(orderId, { total: parseFloat(orderTotal.toFixed(2)) });

      totalOrderItems += itemsCount;

      if (orderId % 10000 === 0) {
        console.log(`   📈 Progress: ${orderId.toLocaleString()}/${SEED_CONFIG.ORDERS.toLocaleString()} orders processed, ${totalOrderItems.toLocaleString()} items created`);
      }
    }

    console.log(`✅ ${totalOrderItems.toLocaleString()} order items seeded successfully`);
  }

  async createIndexes() {
    console.log('🔍 Creating performance indexes...');

    try {
      // Indexes for common query patterns
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(to_tsvector(\'english\', name))');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)');
      await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)');

      console.log('✅ Performance indexes created');
    } catch (error) {
      console.warn('⚠️ Some indexes might already exist:', error.message);
    }
  }

  async run() {
    console.log('🚀 Starting Large Dataset Seeding...');
    console.log(`📊 Target: ${(SEED_CONFIG.USERS + SEED_CONFIG.CATEGORIES + SEED_CONFIG.PRODUCTS + SEED_CONFIG.ORDERS + (SEED_CONFIG.ORDERS * SEED_CONFIG.ORDER_ITEMS_PER_ORDER)).toLocaleString()} total records`);

    const startTime = Date.now();

    try {
      await this.initialize();
      await this.clearExistingData();

      // Seed in order due to foreign key dependencies
      await this.seedUsers();
      await this.seedCategories();
      await this.seedProducts();
      await this.seedOrders();
      await this.seedOrderItems();

      await this.createIndexes();

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      console.log('🎉 Seeding completed successfully!');
      console.log(`⏱️  Total time: ${duration} seconds`);
      console.log(`📊 Database is ready for query optimization testing!`);
      console.log(`🔗 Start the application and visit: http://localhost:3007`);

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    } finally {
      await this.destroy();
    }
  }
}

// Run the seeder
if (require.main === module) {
  const seeder = new LargeDatasetSeeder();
  seeder.run().catch(console.error);
}

export { LargeDatasetSeeder };