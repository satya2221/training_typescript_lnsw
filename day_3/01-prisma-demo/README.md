# Prisma Demo - Day 3 TypeScript Training

## Overview

Demo aplikasi NestJS dengan Prisma ORM untuk PostgreSQL. Menunjukkan:
- ✅ Schema-first development dengan Prisma
- ✅ Type-safe database operations
- ✅ Relational data modeling
- ✅ Lifecycle management dengan graceful shutdown
- ✅ Proper error handling

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database (pastikan PostgreSQL running di Docker)
npx prisma migrate dev --name init

# 3. Seed data
npx prisma db seed

# 4. Start development server
npm run start:dev
```

## API Endpoints

- `GET /products` - List all products with categories
- `GET /products/:id` - Get product with relations
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Example Requests

### Create Product
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Keyboard",
    "price": 89.99,
    "quantity": 25,
    "categoryId": 3
  }'
```

### Get All Products
```bash
curl "http://localhost:3001/products"
```

## Key Features

### 1. Type-Safe Operations
```typescript
// Auto-generated types dari Prisma schema
const products = await this.prisma.product.findMany({
  include: { category: true }  // Type-safe includes
});
```

### 2. Lifecycle Management
```typescript
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 3. Error Handling
```typescript
// Prisma error codes handling
if (error.code === 'P2025') {
  throw new NotFoundException(`Product not found`);
}
```

## Database Schema

- **Users** - Customer data
- **Categories** - Hierarchical product categories
- **Products** - Inventory items with pricing
- **Orders** - Purchase transactions
- **OrderItems** - Line items per order

## Next Steps

Bandingkan dengan TypeORM, Mongoose, dan Mikro-ORM demos untuk melihat perbedaan developer experience dan performance.