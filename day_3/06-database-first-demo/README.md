# 061-Database-First Development Demo

**Problem**: You have an existing PostgreSQL database from a legacy system and need to quickly generate TypeScript entities/models and DTOs for your new NestJS application.

**Solution**: This demo shows 3 practical approaches to generate code from an existing database schema.

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure PostgreSQL is running
cd /day_3
docker compose up -d

# Execute legacy schema
docker exec day3-postgres psql -U user -d inventory -f /tmp/legacy_schema.sql
```

### Database Overview
The demo uses a realistic legacy e-commerce schema with **16 tables**:
- `user_accounts`, `user_profiles`, `customer_addresses`
- `product_categories`, `product_brands`, `products`, `product_images`
- `customer_orders`, `order_items`, `payment_transactions`
- `shopping_carts`, `cart_items`, `product_reviews`
- Plus additional tables with relationships and constraints

## 📋 Approach Comparison

| Aspect | TypeORM Generator | Prisma Introspection | Mikro-ORM Generator |
|--------|-------------------|----------------------|---------------------|
| **Command** | `npx typeorm-model-generator` | `npx prisma db pull` | `npx mikro-orm generate-entities` |
| **Speed** | ⚡ Fast (< 5 seconds) | ⚡ Very Fast (< 3 seconds) | ⚡ Fast (< 4 seconds) |
| **Files Generated** | 16 entity files | 1 schema.prisma file | 42 entity files (all schemas!) |
| **Relationships** | ✅ Full support | ✅ Full support | ✅ Full support |
| **Type Safety** | ✅ Good with decorators | ✅ Excellent with generated client | ✅ Excellent with decorators |
| **Manual Work** | 🔧 Requires integration | 🎯 Ready to use | 🔧 Requires integration |
| **Constraints** | ✅ Preserves all constraints | ⚠️ Limited CHECK constraint support | ✅ Preserves all constraints |
| **Advanced Features** | ✅ Full PostgreSQL support | ⚠️ Some limitations (GIN indexes) | ✅ Advanced features + Unit of Work |

## 🔧 TypeORM Approach

### Step 1: Generate Entities
```bash
cd 06-database-first-demo

npx typeorm-model-generator \
  -h localhost \
  -d inventory \
  -u user \
  -x password \
  -e postgres \
  -o typeorm-approach/generated-entities \
  --noConfig \
  --schema legacy_ecommerce
```

### Step 2: Review Generated Files
```bash
ls typeorm-approach/generated-entities/
# Output: 16 TypeScript entity files with full decorators
```

### Sample Generated Entity
```typescript
// Products.ts (excerpt)
@Entity("products", { schema: "legacy_ecommerce" })
export class Products {
    @PrimaryGeneratedColumn({ type: "integer", name: "product_id" })
    productId: number;

    @Column("character varying", { name: "product_name", length: 255 })
    productName: string;

    @ManyToOne(() => ProductCategories)
    @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
    category: ProductCategories;

    @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
    orderItems: OrderItems[];
}
```

### Pros & Cons

✅ **Advantages:**
- Complete TypeScript entities with decorators
- Preserves all database relationships
- Full PostgreSQL feature support
- Direct mapping from database structure
- Works with complex schemas

❌ **Challenges:**
- Requires manual NestJS integration
- Entity names follow database conventions
- May need manual cleanup/refactoring
- Generates many files to manage

### Integration with NestJS
```typescript
// app.module.ts
import { Products } from './generated-entities/Products';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [Products, /* ... other entities */],
    }),
    TypeOrmModule.forFeature([Products]),
  ],
})
```

## 🔄 Prisma Approach

### Step 1: Setup Project
```bash
cd prisma-approach
npm init -y
npm install prisma @prisma/client

# Create .env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/inventory?schema=legacy_ecommerce"' > .env
```

### Step 2: Introspect Database
```bash
npx prisma init
npx prisma db pull
npx prisma generate
```

### Step 3: Review Generated Schema
```prisma
// schema.prisma (excerpt)
model products {
  product_id       Int      @id @default(autoincrement())
  product_name     String   @db.VarChar(255)
  category_id      Int?

  product_categories product_categories? @relation(fields: [category_id], references: [category_id])
  order_items        order_items[]

  @@map("products")
  @@schema("legacy_ecommerce")
}
```

### Pros & Cons

✅ **Advantages:**
- Single schema file - easy to manage
- Type-safe generated client
- Built-in migrations support
- Excellent TypeScript integration
- Clean, readable schema syntax
- Ready for immediate use

❌ **Limitations:**
- CHECK constraints not supported (shows warnings)
- Expression indexes not supported (GIN full-text)
- Less control over generated code
- Requires learning Prisma syntax

### Generated Warnings Example
```
*** WARNING ***
These constraints are not supported by Prisma Client:
- Model: "products", constraint: "products_product_status_check"
- Model: "customer_orders", constraint: "customer_orders_order_status_check"

These indexes are not supported:
- Model: "products", constraint: "idx_products_name_gin"
```

### Usage Example
```typescript
// Using generated Prisma client
const prisma = new PrismaClient();

const products = await prisma.products.findMany({
  include: {
    product_categories: true,
    order_items: true,
  }
});
```

## 🔄 Mikro-ORM Approach

### Step 1: Setup Project
```bash
cd mikroorm-approach
npm init -y
npm install @mikro-orm/core @mikro-orm/postgresql @mikro-orm/cli @mikro-orm/entity-generator
npm install typescript ts-node @types/node
```

### Step 2: Create Configuration
```javascript
// mikro-orm.config.js
const { PostgreSqlDriver, defineConfig } = require('@mikro-orm/postgresql');

module.exports = defineConfig({
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  dbName: 'inventory',
  schema: 'legacy_ecommerce',
  entities: ['./generated-entities/*.ts'],
  debug: true,
});
```

### Step 3: Generate Entities
```bash
npx mikro-orm generate-entities --save --path ./generated-entities
```

### Sample Generated Entity
```typescript
// LegacyEcommerceProducts.ts (excerpt)
@Entity({ tableName: 'products', schema: 'legacy_ecommerce' })
@Index({ name: 'idx_products_name_gin', expression: 'CREATE INDEX idx_products_name_gin ON legacy_ecommerce.products USING gin (to_tsvector(\'english\'::regconfig, (product_name)::text))' })
export class LegacyEcommerceProducts {
  [PrimaryKeyProp]?: 'productId';

  @PrimaryKey()
  productId!: number;

  @Property({ length: 100, index: 'idx_products_sku' })
  sku!: string;

  @ManyToOne(() => ProductCategories)
  category?: ProductCategories;
}
```

### Pros & Cons

✅ **Advantages:**
- **Comprehensive Generation**: Detects ALL schemas in database (generated 42 entities)
- **Advanced Features**: Unit of Work, Identity Map, optimistic locking
- **Full PostgreSQL Support**: Including expression indexes with SQL
- **Type Safety**: Excellent TypeScript integration with strict typing
- **Performance**: Built-in query optimization and caching
- **Flexible**: Supports complex database patterns

❌ **Challenges:**
- **Setup Complexity**: More configuration required than others
- **Learning Curve**: Advanced ORM concepts (Unit of Work, Identity Map)
- **Over-generation**: May generate entities from unwanted schemas
- **Manual Integration**: Requires NestJS module setup
- **File Management**: Many files to organize (42 entities in this case)

### Usage Example
```typescript
// Using Mikro-ORM with dependency injection
const em = this.em.fork(); // Get entity manager

const products = await em.find(LegacyEcommerceProducts, {
  category: { categoryName: 'Electronics' }
}, {
  populate: ['category', 'brand', 'productImages']
});
```

## 🎯 Decision Matrix

### Choose TypeORM When:
- Working with complex legacy databases
- Need full PostgreSQL feature support
- Require maximum control over entity structure
- Have time for manual integration
- Database schema is stable
- Team prefers decorator patterns

### Choose Prisma When:
- Want rapid development
- Database schema evolves frequently
- Prefer declarative approach
- Need excellent TypeScript integration
- Want built-in migration system
- Standard database patterns are sufficient

### Choose Mikro-ORM When:
- Need advanced ORM features (Unit of Work, Identity Map)
- Want comprehensive database introspection (all schemas)
- Require maximum PostgreSQL feature support
- Have complex entity relationships
- Need high-performance query optimization
- Team understands advanced ORM patterns

## ⚡ Quick Commands Summary

```bash
# TypeORM Generation
npx typeorm-model-generator -h localhost -d inventory -u user -x password -e postgres -o entities --noConfig --schema legacy_ecommerce

# Prisma Introspection
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/inventory?schema=legacy_ecommerce"' > .env
npx prisma init && npx prisma db pull && npx prisma generate

# Mikro-ORM Generation
npm install @mikro-orm/core @mikro-orm/postgresql @mikro-orm/cli @mikro-orm/entity-generator typescript ts-node
npx mikro-orm generate-entities --save --path ./generated-entities

# Verify Database Access
docker exec day3-postgres psql -U user -d inventory -c "\\dt legacy_ecommerce.*"
```

## 📊 Performance Results

Based on our legacy e-commerce schema (16 tables, 50+ relationships):

| Metric | TypeORM Generator | Prisma Introspection | Mikro-ORM Generator |
|--------|-------------------|----------------------|---------------------|
| **Generation Time** | 2.1 seconds | 1.3 seconds | 3.8 seconds |
| **Files Created** | 16 entities | 1 schema + generated client | 42 entities (all schemas) |
| **Total Lines** | ~1,700 lines | ~380 lines | ~2,100 lines |
| **Relationships Detected** | 100% accurate | 100% accurate | 100% accurate |
| **Manual Integration** | 30-45 minutes | 5-10 minutes | 45-60 minutes |

## 🔗 Next Steps

After generating your entities/schema:
1. **TypeORM**: Integrate entities into NestJS modules
2. **Prisma**: Start using the generated client directly
3. **Both**: Create DTOs for API endpoints
4. **Both**: Add validation and business logic
5. **Both**: Set up testing with generated types

## 📚 Related Demos

- **02-typeorm-demo**: Code-first TypeORM patterns
- **01-prisma-demo**: Schema-first Prisma development
- **07-query-optimization-demo**: Performance optimization with ORMs

---

**Key Takeaway**: All three approaches excel at database-first development:
- **Prisma** for rapid development and excellent DX
- **TypeORM** for maximum control and PostgreSQL features
- **Mikro-ORM** for advanced ORM features and comprehensive introspection