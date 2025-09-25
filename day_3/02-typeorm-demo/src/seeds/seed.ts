import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'inventory',
  schema: 'typeorm_demo', // Use separate schema to avoid conflicts
  entities: [User, Category, Product, Order, OrderItem],
});

async function seed() {
  console.log('🌱 Seeding TypeORM database...');

  await AppDataSource.initialize();

  // Create users
  const userRepo = AppDataSource.getRepository(User);
  const user1 = await userRepo.save({
    email: 'john.typeorm@example.com',
    name: 'John Doe (TypeORM)',
  });

  const user2 = await userRepo.save({
    email: 'jane.typeorm@example.com',
    name: 'Jane Smith (TypeORM)',
  });

  // Create categories
  const categoryRepo = AppDataSource.getRepository(Category);
  const electronicsCategory = await categoryRepo.save({
    name: 'Electronics',
  });

  const laptopsCategory = await categoryRepo.save({
    name: 'Laptops',
    parentId: electronicsCategory.id,
  });

  const accessoriesCategory = await categoryRepo.save({
    name: 'Accessories',
  });

  // Create products
  const productRepo = AppDataSource.getRepository(Product);
  const product1 = await productRepo.save({
    name: 'ThinkPad X1 Carbon',
    description: 'Business ultrabook with TypeORM',
    price: 2199.99,
    quantity: 12,
    categoryId: laptopsCategory.id,
  });

  const product2 = await productRepo.save({
    name: 'MacBook Air M2',
    description: 'Apple laptop managed by TypeORM',
    price: 1399.99,
    quantity: 5,
    categoryId: laptopsCategory.id,
  });

  const product3 = await productRepo.save({
    name: 'USB-C Hub',
    description: 'Multi-port hub (TypeORM demo)',
    price: 79.99,
    quantity: 2, // Low stock for testing
    categoryId: accessoriesCategory.id,
  });

  // Create order with items using QueryRunner for transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const order = await queryRunner.manager.save(Order, {
      userId: user1.id,
      total: 2279.98,
      status: OrderStatus.COMPLETED,
    });

    await queryRunner.manager.save(OrderItem, [
      {
        orderId: order.id,
        productId: product1.id,
        quantity: 1,
        unitPrice: 2199.99,
      },
      {
        orderId: order.id,
        productId: product3.id,
        quantity: 1,
        unitPrice: 79.99,
      },
    ]);

    await queryRunner.commitTransaction();
    console.log('✅ TypeORM database seeded successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }

  console.log('📊 Created:');
  console.log(`  - ${2} users`);
  console.log(`  - ${3} categories`);
  console.log(`  - ${3} products`);
  console.log(`  - ${1} orders with transactions`);

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error seeding TypeORM database:', error);
  process.exit(1);
});