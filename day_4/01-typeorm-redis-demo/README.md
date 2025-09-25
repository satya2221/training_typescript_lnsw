# NestJS + TypeORM Demo

This demo showcases **Code-First approach** with TypeORM, demonstrating the Repository pattern and advanced query capabilities using QueryBuilder.

## 🎯 **Demo Focus**

- **Code-First Development**: Define entities with decorators, database schema auto-generated
- **Repository Pattern**: Clean separation using `@InjectRepository`
- **Advanced Queries**: QueryBuilder for complex SQL operations
- **Relationships**: One-to-many, many-to-one with proper foreign keys
- **Query Logging**: Enabled to see generated SQL
- **Transaction Support**: Using QueryRunner for data consistency

## 🏗️ **Architecture**

```
src/
├── entities/           # TypeORM entities with decorators
│   ├── user.entity.ts         # User entity
│   ├── category.entity.ts     # Category entity
│   ├── product.entity.ts      # Product with relationships
│   ├── order.entity.ts        # Order entity
│   └── order-item.entity.ts   # Order items (junction table)
└── products/           # Products feature module
    ├── products.service.ts    # Business logic with Repository
    ├── products.controller.ts # REST endpoints
    └── products.module.ts     # Feature module
```

## 🚀 **Getting Started**

### Prerequisites
- Docker containers running: `docker-compose up -d`
- PostgreSQL available on port 5432

### Installation & Run
```bash
cd 02-typeorm-demo
npm install
npm run start:dev  # Runs on http://localhost:3002
```

### Database Schema
- Uses separate `typeorm_demo` schema to avoid conflicts
- Auto-generates tables from entity definitions
- Query logging enabled to see SQL output

## 📚 **Key Features Demonstrated**

### 1. **Entity Definitions**
```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];
}
```

### 2. **Repository Pattern**
```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'orderItems'],
    });
  }
}
```

### 3. **QueryBuilder for Complex Queries**
```typescript
async findProductsWithStats() {
  return this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.orderItems', 'orderItems')
    .addSelect('COUNT(orderItems.id)', 'orderCount')
    .groupBy('product.id')
    .getRawAndEntities();
}
```

## 🛠️ **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Get all products with relationships |
| `GET` | `/products/:id` | Get product by ID with full details |
| `POST` | `/products` | Create new product |
| `PUT` | `/products/:id` | Update existing product |
| `DELETE` | `/products/:id` | Delete product |
| `GET` | `/products/complex-query` | Demonstrate QueryBuilder usage |

### Example Requests
```bash
# Get all products
curl http://localhost:3002/products

# Get specific product
curl http://localhost:3002/products/1

# Create new product
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","price":29.99,"categoryId":1}'
```

## 💡 **Learning Objectives**

### **TypeORM Advantages**
- ✅ **Familiar Decorators**: Similar to other ORMs (JPA, Entity Framework)
- ✅ **TypeScript-First**: Excellent type safety and IntelliSense
- ✅ **Migration Support**: Production-ready database versioning
- ✅ **QueryBuilder**: Powerful SQL builder for complex queries
- ✅ **Active Record/Data Mapper**: Choose your preferred pattern

### **When to Choose TypeORM**
- Coming from Java/C# background (familiar annotations)
- Need complex queries with QueryBuilder
- Require fine-grained control over SQL generation
- Working with existing database schemas
- Need both Active Record and Repository patterns

### **Comparison with Prisma**
| Feature | TypeORM | Prisma |
|---------|---------|--------|
| **Approach** | Code-first | Schema-first |
| **Type Safety** | Good (decorators) | Excellent (generated) |
| **Query Builder** | ✅ Powerful | ❌ Limited |
| **Migrations** | ✅ Built-in | ✅ Built-in |
| **Learning Curve** | Moderate | Easy |
| **Performance** | Good | Better (optimized queries) |

## 🔧 **Development Commands**

```bash
# Development
npm run start:dev     # Start with hot reload
npm run build         # Build for production

# Database
npm run typeorm:migration:generate -- -n MigrationName
npm run typeorm:migration:run

# Code Quality
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Unit tests
```

## 📊 **Database Schema Generated**

The TypeORM entities automatically generate this schema in PostgreSQL:

```sql
-- Schema: typeorm_demo
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables: users, orders, order_items
```

---

**Port**: 3002
**Database**: PostgreSQL (schema: `typeorm_demo`)
**Key Pattern**: Repository Pattern with Code-First entities