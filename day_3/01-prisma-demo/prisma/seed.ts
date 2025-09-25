import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  });

  // Create categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Electronics',
    },
  });

  const laptopsCategory = await prisma.category.create({
    data: {
      name: 'Laptops',
      parentId: electronicsCategory.id,
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'MacBook Pro M3',
      description: 'Latest MacBook Pro with M3 chip',
      price: 2999.99,
      quantity: 15,
      categoryId: laptopsCategory.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Dell XPS 13',
      description: 'Ultrabook with Intel Core i7',
      price: 1299.99,
      quantity: 8,
      categoryId: laptopsCategory.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: 49.99,
      quantity: 3, // Low stock for testing
      categoryId: accessoriesCategory.id,
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 3049.98,
      status: 'COMPLETED',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 2999.99,
          },
          {
            productId: product3.id,
            quantity: 1,
            unitPrice: 49.99,
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`  - ${2} users`);
  console.log(`  - ${3} categories`);
  console.log(`  - ${3} products`);
  console.log(`  - ${1} orders`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });