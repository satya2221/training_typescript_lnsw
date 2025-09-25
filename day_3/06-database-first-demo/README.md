# 06-Database-First Demo: Legacy Schema Migration

This demo showcases **database-first development** approaches when migrating from legacy systems to modern TypeScript applications using both **TypeORM model generator** and **Prisma introspection**.

## 🎯 Learning Objectives

- Generate TypeScript entities from existing databases
- Compare TypeORM vs Prisma for database-first workflows
- Handle complex legacy database schemas with advanced features
- Understand automation strategies for entity/schema generation
- Learn migration patterns from legacy systems

## 🏗️ Architecture Overview

```
Legacy PostgreSQL Database (16 tables)
├── Complex e-commerce schema with realistic constraints
├── Mixed naming conventions (legacy patterns)
├── Advanced features: JSONB, CHECK constraints, GIN indexes
└── Foreign key relationships with self-referencing tables

↓ Database-First Generation ↓

TypeORM Entities (Generated)          Prisma Schema (Introspected)
├── Complete TypeScript classes       ├── Clean declarative models
├── Decorator-based relationships     ├── Auto-inferred relationships
├── All indexes and constraints       ├── Warnings for unsupported features
└── Requires manual integration       └── Type-safe client generation
```

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Ensure PostgreSQL is running with legacy schema
docker compose up -d
docker exec day3-postgres psql -U user -d inventory -f /tmp/legacy_schema.sql
```

### 2. Start the Demo
```bash
cd 06-database-first-demo
npm install
npm run start:dev
```

### 3. Access Demo Endpoints
- **Demo Home**: http://localhost:3006
- **Comparison Report**: http://localhost:3006/comparison
- **TypeORM Info**: http://localhost:3006/typeorm/entities
- **Prisma Info**: http://localhost:3006/prisma/schema

## 📊 API Endpoints

### GET `/comparison`
Complete comparison analysis between TypeORM and Prisma approaches.

**Response Structure:**
```json
{
  "title": "Database-First Development: TypeORM vs Prisma",
  "legacy_database": {
    "tables": ["user_accounts", "products", "customer_orders", ...],
    "complexity": {
      "relationships": "Complex foreign keys and self-referencing",
      "constraints": "CHECK constraints for enums and validation",
      "indexes": "Performance-optimized with composite and partial indexes"
    }
  },
  "typeorm_generation": {
    "pros": ["Complete TypeScript entities", "Preserves relationships", ...],
    "cons": ["Entity names follow database", "Manual integration", ...]
  },
  "prisma_introspection": {
    "pros": ["Clean schema", "Type-safe client", "Built-in migrations", ...],
    "cons": ["Check constraints not supported", "Less flexible", ...]
  },
  "recommendations": {
    "choose_typeorm_when": [...],
    "choose_prisma_when": [...]
  }
}
```

### GET `/typeorm/entities`
Information about generated TypeORM entities.

### GET `/prisma/schema`
Details about Prisma schema introspection results.

## 🔧 Generation Commands Used

### TypeORM Model Generator
```bash
npx typeorm-model-generator \
  -h localhost \
  -d inventory \
  -u user \
  -x password \
  -e postgres \
  -o src/generated/typeorm \
  --noConfig \
  --schema legacy_ecommerce
```

**Generated Files:**
- `Products.ts` - Complete product entity with relationships
- `UserAccounts.ts` - User management with profile relations
- `CustomerOrders.ts` - Order processing with payment tracking
- `ProductCategories.ts` - Hierarchical category structure
- And 12 more entities...

### Prisma Introspection
```bash
# Setup schema file
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/inventory?schema=legacy_ecommerce"' > .env

# Generate schema from database
npx prisma db pull
```

**Generated Schema:**
- 16 Prisma models with relationships
- Warnings for unsupported CHECK constraints
- Warnings for expression indexes (GIN full-text search)
- All foreign keys properly mapped

## 🧪 Testing the Demo

### Basic Functionality Test
```bash
# Test all endpoints
curl http://localhost:3006/
curl http://localhost:3006/comparison | jq .title
curl http://localhost:3006/typeorm/entities | jq .message
curl http://localhost:3006/prisma/schema | jq .models
```

### Generated Files Verification
```bash
# Check TypeORM entities
ls -la 06-database-first-demo/src/generated/typeorm/
cat 06-database-first-demo/src/generated/typeorm/Products.ts

# Check Prisma schema
cat 06-database-first-demo/prisma/schema.prisma
```

## 📈 Key Comparison Points

| Aspect | TypeORM Generator | Prisma Introspection |
|--------|-------------------|----------------------|
| **Setup Complexity** | High - manual integration | Low - single command |
| **Code Quality** | Raw DB structure | Clean abstractions |
| **Type Safety** | Good - decorators | Excellent - generated client |
| **DB Features** | Full PostgreSQL support | Limited advanced features |
| **Maintenance** | Manual regeneration | Semi-automatic |
| **Learning Curve** | Steep | Moderate |

## 🎯 When to Choose Each Approach

### Choose TypeORM When:
- Working with complex legacy databases
- Need full control over entity structure
- Require advanced PostgreSQL features
- Team has strong TypeORM experience
- Database schema is stable

### Choose Prisma When:
- Want excellent developer experience
- Database schema evolves frequently
- Prefer declarative schema management
- Need built-in migration system
- Working with standard patterns

## 🔄 Automation Opportunities

### TypeORM Automation Scripts:
```bash
# Entity name normalization
sed -i 's/snake_case/PascalCase/g' src/generated/typeorm/*.ts

# DTO generation from entities
npx ts-node scripts/generate-dtos.ts

# Basic CRUD service generation
npx ts-node scripts/generate-services.ts
```

### Prisma Automation:
```bash
# Auto-generate client after schema changes
npx prisma generate

# Database visualization
npx prisma studio

# Type-safe query examples
npx ts-node examples/prisma-queries.ts
```

## 📚 Real-World Migration Patterns

1. **Assessment Phase**: Analyze legacy database complexity
2. **Tool Selection**: Choose based on requirements matrix
3. **Generation**: Run model generator or introspection
4. **Refinement**: Clean up generated code
5. **Integration**: Wire into NestJS application
6. **Testing**: Verify all relationships work correctly
7. **Documentation**: Update team knowledge base

## 🔗 Related Demos

- **01-prisma-demo**: Schema-first Prisma development
- **02-typeorm-demo**: Code-first TypeORM patterns
- **07-query-optimization-demo**: Performance with generated entities

---

**Note**: This demo uses a realistic legacy e-commerce database with 16 tables, complex relationships, and advanced PostgreSQL features to demonstrate real-world database-first migration scenarios.