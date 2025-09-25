# Day 3: Advanced Database Integration with TypeScript

This directory contains demo projects showcasing different ORM approaches for TypeScript applications.

## 🎯 Learning Objectives

- Compare different ORM patterns and approaches
- Understand trade-offs between schema-first vs code-first development
- Master database relationships and query optimization
- Implement proper error handling and validation
- Use transactions and advanced database features

## 🚀 Demo Projects

### 1. Prisma Demo (Port 3001)

**Location**: `01-prisma-demo/`

**Key Features**:
- Schema-first approach with `schema.prisma`
- Auto-generated TypeScript types
- Type-safe database client
- Lifecycle management with `onModuleInit`/`onModuleDestroy`
- Built-in connection pooling and query optimization

**Architecture Highlights**:
```typescript
// Schema-first approach
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  category    Category @relation(fields: [categoryId], references: [id])
}

// Auto-generated client usage
const products = await this.prisma.product.findMany({
  include: { category: true }
});
```

**Start Commands**:
```bash
cd 01-prisma-demo
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run start:dev
```

### 2. TypeORM Demo (Port 3002)

**Location**: `02-typeorm-demo/`

**Key Features**:
- Code-first approach with decorators
- Repository pattern with `@InjectRepository`
- QueryBuilder for complex queries
- Custom enum types and relationships
- Schema synchronization with separate namespace

**Architecture Highlights**:
```typescript
// Code-first approach with decorators
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

// Repository pattern usage
const products = await this.productRepository
  .createQueryBuilder('product')
  .leftJoinAndSelect('product.category', 'category')
  .where('product.quantity <= :threshold', { threshold: 10 })
  .getMany();
```

**Start Commands**:
```bash
cd 02-typeorm-demo
npm install
npm run start:dev
npx ts-node src/seeds/seed.ts
```

### 3. Mongoose Demo (Port 3003)

**Location**: `03-mongoose-demo/`

**Key Features**:
- Document-based schema with MongoDB
- Embedded documents and denormalization
- Rich metadata with flexible schemas
- Virtual population and middleware
- Array fields and nested objects
- Text search and aggregation pipelines

**Architecture Highlights**:
```typescript
// Document-based schema with embedded objects
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: PriceSchema })
  pricing: PriceInfo;

  @Prop({ type: InventorySchema })
  inventory: InventoryInfo;

  @Prop([String])
  tags: string[];

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

// MongoDB aggregation pipeline
const stats = await this.productModel
  .aggregate([
    { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' }},
    { $group: { _id: '$category._id', avgPrice: { $avg: '$pricing.current' }}},
    { $sort: { productCount: -1 }}
  ]);
```

**Start Commands**:
```bash
cd 03-mongoose-demo
npm install
npm run start:dev
npx ts-node src/seeds/seed.ts
```

### 4. Mikro-ORM Demo (Port 3004)

**Location**: `04-mikro-orm-demo/`

**Key Features**:
- Advanced ORM with Unit of Work pattern
- Identity Map for entity management
- Optimistic locking with version fields
- Soft deletes and advanced TypeScript integration
- JSON attributes and array fields
- Separate `mikroorm_demo` PostgreSQL schema

**Architecture Highlights**:
```typescript
// Advanced entity with Mikro-ORM features
@Entity({ tableName: 'products' })
export class Product extends BaseEntity {
  @Property()
  name!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ version: true })
  version!: number;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property({ type: 'json', nullable: true })
  attributes?: any;

  @Property({ type: 'array', nullable: true })
  tags?: string[];

  // Virtual properties
  @Property({ persist: false })
  get isInStock(): boolean {
    return this.quantity > 0;
  }

  // Business logic methods
  softDelete(): void {
    this.deletedAt = new Date();
  }
}

// Unit of Work pattern usage
await this.em.transactional(async (em) => {
  const product = await em.findOneOrFail(Product, { id });
  product.updatePrice(newPrice);
  // Changes tracked automatically, flushed at transaction end
});
```

**Start Commands**:
```bash
cd 04-mikro-orm-demo
npm install
npm run start:dev
npx ts-node src/seeds/seed.ts
```

## 📊 ORM/ODM Comparison

| Feature | Prisma | TypeORM | Mongoose | Mikro-ORM |
|---------|--------|---------|----------|-----------|
| **Database Type** | SQL (PostgreSQL) | SQL (PostgreSQL) | NoSQL (MongoDB) | SQL (PostgreSQL) |
| **Approach** | Schema-first | Code-first | Schema-based | Code-first |
| **Type Safety** | Excellent (generated) | Good (decorators) | Good (schemas) | Excellent (decorators) |
| **Query Builder** | Limited | Extensive | Aggregation Pipeline | Advanced |
| **Raw Query Support** | Good | Excellent | Native MongoDB | Excellent |
| **Schema Evolution** | Migrations | Migrations/Sync | Flexible | Migrations |
| **Relationships** | Explicit joins | Explicit joins | Embedded/Referenced | Explicit joins |
| **Data Flexibility** | Rigid structure | Rigid structure | Dynamic schema | JSON fields |
| **Learning Curve** | Easier | Steeper | Moderate | Steep |
| **Performance** | Optimized | Manual tuning | Horizontal scaling | Identity Map |
| **Enterprise Features** | Growing | Mature | Document-focused | Advanced patterns |
| **Best Use Case** | CRUD apps | Complex SQL | Flexible data models | Enterprise apps |

## 🔧 Database Setup

All SQL demos use the same PostgreSQL instance but separate schemas to avoid conflicts:

- **Prisma**: Uses `public` schema
- **TypeORM**: Uses `typeorm_demo` schema
- **Mikro-ORM**: Uses `mikroorm_demo` schema
- **Mongoose**: Uses MongoDB `inventory` database

```bash
# Start databases
docker compose up -d

# Access PostgreSQL
docker exec -it day3-postgres psql -U user -d inventory
```

## 🧪 Testing the APIs

### Prisma Demo (3001)
```bash
curl http://localhost:3001/products
curl http://localhost:3001/products/1
```

### TypeORM Demo (3002)
```bash
curl http://localhost:3002/products
curl http://localhost:3002/products/1
```

### Mongoose Demo (3003)
```bash
curl http://localhost:3003/products
curl "http://localhost:3003/products/search?q=laptop"
curl http://localhost:3003/products/stats/by-category
curl "http://localhost:3003/products/by-tags?tags=business,premium"
curl "http://localhost:3003/products/price-range?min=1000&max=2000"
```

### Mikro-ORM Demo (3004)
```bash
curl http://localhost:3004/products
curl http://localhost:3004/products/1
curl http://localhost:3004/products/test
```

## 🎓 Key Learning Points

### 1. Schema Design Patterns
- **Prisma**: Define schema in declarative DSL, generate client code
- **TypeORM**: Define entities with TypeScript classes, sync to database
- **Mikro-ORM**: Advanced decorators with Unit of Work pattern

### 2. Relationship Handling
- **Prisma**: Implicit joins with `include` and `select`
- **TypeORM**: Explicit joins with `relations` or `QueryBuilder`
- **Mikro-ORM**: Lazy loading with Identity Map optimization

### 3. Query Patterns
- **Prisma**: Fluent API with type-safe operations
- **TypeORM**: Repository pattern + QueryBuilder for complex scenarios
- **Mikro-ORM**: EntityManager with advanced query capabilities

### 4. Performance Considerations
- **Prisma**: Built-in query optimization and connection pooling
- **TypeORM**: Manual optimization with QueryBuilder and raw SQL
- **Mikro-ORM**: Identity Map reduces database calls, Unit of Work batches changes

### 5. Developer Experience
- **Prisma**: Excellent auto-completion and type safety
- **TypeORM**: More flexible but requires deeper knowledge
- **Mongoose**: Good schema validation with flexible document structure
- **Mikro-ORM**: Advanced features with steep learning curve but powerful patterns

### 6. NoSQL Advantages (Mongoose)
- **Embedded Documents**: Rich nested data structures without joins
- **Flexible Schema**: Dynamic fields and metadata support
- **Aggregation Pipelines**: Powerful data processing and analytics
- **Text Search**: Built-in full-text search capabilities
- **Horizontal Scaling**: Natural document-based partitioning

## 📈 Next Steps

Future demos will include:
- Multi-database architecture patterns
- Performance optimization techniques
- Security best practices
- Connection pooling strategies

---

**Note**: All four demos (Prisma, TypeORM, Mongoose, Mikro-ORM) are fully functional with realistic e-commerce data including users, categories, products, and orders with proper relationships and constraints. Each demonstrates different approaches to database integration in TypeScript applications, from schema-first (Prisma) to advanced ORM patterns (Mikro-ORM) to document-based NoSQL (Mongoose).