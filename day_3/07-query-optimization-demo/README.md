# 🚀 Query Optimization Demo - TypeScript Day 3

Demonstrasi lengkap optimasi query database menggunakan NestJS + TypeORM dengan fokus pada **performance analysis**, **security patterns**, dan **query optimization techniques**.

## 🎯 Tujuan Demo

Demo ini dirancang untuk memenuhi permintaan spesifik:

1. **Query kompleks yang tidak optimum** dan cara mengatasinya
2. **Raw query dengan secure coding mindset** (SQL injection prevention)
3. **Data dummy dalam jumlah besar** untuk testing realistic
4. **Query logging dan EXPLAIN ANALYZE** untuk analisis performa
5. **Benchmark before/after** untuk membuktikan optimasi

## 📊 Apa Yang Ada Di Demo Ini?

### 🐌 Bad Queries (Anti-Patterns)
- **N+1 Query Problem**: Loading data dengan nested loops
- **Missing Indexes**: Query tanpa index yang efisien
- **Inefficient Pagination**: OFFSET-based pagination yang lambat
- **SQL Injection Vulnerabilities**: Raw query yang tidak aman
- **Memory Loading**: Load seluruh dataset ke memory untuk perhitungan

### ⚡ Optimized Queries
- **Proper JOINs**: Menggabungkan data dengan satu query
- **Cursor-based Pagination**: Pagination yang scalable
- **Selective Loading**: Load hanya kolom yang dibutuhkan
- **Parameterized Queries**: SQL injection prevention
- **Database Aggregation**: Kalkulasi di database, bukan di memory

### 🏁 Performance Analysis
- **EXPLAIN ANALYZE Integration**: Analisis execution plan PostgreSQL
- **Benchmark Suite**: Perbandingan performa dengan metrik statistik
- **Query Logging**: Monitor semua query yang dieksekusi
- **Stress Testing**: Test konsistensi performa dengan multiple iterations

## 🗄️ Dataset

Demo menggunakan realistic e-commerce schema dengan:
- **50,000** Users
- **100,000** Products
- **200,000** Orders
- **800,000** Order Items
- **Total: ~850,000 records**

## 🚀 Quick Start

### 1. Setup Database
```bash
# Pastikan PostgreSQL container running
cd /Users/chmdznr/work/lnsw/typescript/day_3
docker compose up -d
```

### 2. Install Dependencies
```bash
cd 07-query-optimization-demo
npm install
```

### 3. Start Application
```bash
npm run start:dev
```
✅ Server akan running di: **http://localhost:3007**

### 4. Seed Large Dataset (IMPORTANT!)
```bash
# Seed 850K+ records untuk testing yang realistic
npx ts-node src/seeds/large-dataset.seed.ts
```
⚠️ **Note**: Seeding butuh waktu ~2-5 menit tergantung spec komputer

## 📡 API Endpoints

### 📋 Info & Status
```bash
GET /info                    # Informasi lengkap tentang demo
```

### 🐌 Bad Queries (Demonstrasi Anti-Pattern)
```bash
GET /bad/n1-problem          # N+1 query problem
GET /bad/search              # Inefficient LIKE search
GET /bad/statistics          # Multiple separate queries
GET /bad/all                 # Jalankan semua bad queries
```

### ⚡ Optimized Queries
```bash
GET /optimized/n1-problem    # Proper JOINs
GET /optimized/search        # Indexed search with aggregation
GET /optimized/statistics    # Single aggregated query
GET /optimized/all           # Jalankan semua optimized queries
```

### 🏁 Performance Benchmarks
```bash
GET /benchmark/full          # Complete benchmark semua tests
GET /benchmark/n1            # Benchmark N+1 problem only
GET /benchmark/search        # Benchmark search only
GET /benchmark/statistics    # Benchmark statistics only
```

## 🧪 Contoh Penggunaan

### 1. Lihat Info Demo
```bash
curl http://localhost:3007/info
```

### 2. Test N+1 Problem
```bash
# Bad version (banyak queries)
curl "http://localhost:3007/bad/n1-problem?limit=10"

# Optimized version (1 query dengan JOINs)
curl "http://localhost:3007/optimized/n1-problem?limit=10"
```

### 3. Benchmark Performance
```bash
# Full benchmark dengan statistik lengkap
curl http://localhost:3007/benchmark/full

# Hasil akan menunjukkan:
# - Execution time comparison
# - Query count reduction
# - Percentage improvement
# - Recommendations
```

### 4. Search Performance Test
```bash
# Bad search (LIKE tanpa index)
curl "http://localhost:3007/bad/search?term=laptop&limit=20"

# Optimized search (dengan proper indexing)
curl "http://localhost:3007/optimized/search?term=laptop&limit=20"
```

## 📈 Monitoring & Analysis

### Query Logging
TypeORM logging sudah enabled untuk melihat SQL queries:
```javascript
logging: ['query', 'error']  // di app.module.ts
```

### EXPLAIN ANALYZE Integration
Demo ini mengintegrasikan PostgreSQL EXPLAIN ANALYZE untuk analisis mendalam:
- **Execution Plan Analysis**
- **Index Usage Detection**
- **Performance Bottleneck Identification**
- **Automated Recommendations**

### Performance Metrics
Setiap response menyertakan metadata:
```json
{
  "data": [...],
  "executionTime": 145,
  "queryCount": 3,
  "metadata": {
    "description": "N+1 problem demonstration",
    "problem": "Executes multiple queries instead of JOINs",
    "impact": "3 queries executed instead of 1 optimized query"
  }
}
```

## 🔒 Security Patterns

### SQL Injection Prevention
Demo menunjukkan:
- ❌ **Vulnerable**: Raw query dengan string concatenation
- ✅ **Safe**: Parameterized queries dengan TypeORM
- ✅ **Best Practice**: ORM query builder usage

```typescript
// ❌ VULNERABLE (untuk demo purposes)
const unsafeQuery = `SELECT * FROM products WHERE name LIKE '%${userInput}%'`;

// ✅ SAFE
const safeQuery = this.productRepository
  .createQueryBuilder('product')
  .where('product.name ILIKE :term', { term: `%${searchTerm}%` });
```

## 🔍 Detailed Problem Analysis & Solutions

### 1. N+1 Query Problem

#### ❌ **Bad Pattern**:
```typescript
// Loads users first, then makes separate query for each user's orders
const users = await this.userRepository.find({ take: limit });
for (const user of users) {
  const orders = await this.orderRepository.find({ 
    where: { userId: user.id } 
  });
  user.orders = orders;
}
// Result: 1 + N queries (1 for users + N for each user's orders)
```

#### 🚨 **Why It's Bad**:
- **Performance**: Executes 1 + N database queries instead of 1
- **Network Overhead**: Multiple round trips to database
- **Scalability**: Performance degrades linearly with data size
- **Resource Usage**: Inefficient connection pool usage

#### ✅ **Optimized Solution**:
```typescript
// Single query with JOIN to get all data at once
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.orders', 'order')
  .take(limit)
  .getMany();
// Result: 1 query total
```

#### 📊 **Performance Impact**: 50-95% improvement, 1 query vs N+1 queries

---

### 2. Inefficient Search Queries

#### ❌ **Bad Pattern**:
```typescript
// Uses LIKE without indexes, plus N+1 for additional data
const products = await this.productRepository
  .createQueryBuilder('product')
  .where('product.name LIKE :search', { search: `%${term}%` })
  .getMany();

for (const product of products) {
  const orderCount = await this.orderItemRepository.count({
    where: { product: { id: product.id } }
  });
  product.orderCount = orderCount;
}
```

#### 🚨 **Why It's Bad**:
- **No Index Usage**: LIKE queries don't use standard B-tree indexes efficiently
- **Full Table Scan**: Database scans entire table for pattern matching
- **N+1 Problem**: Additional query for each product's order count
- **Case Sensitivity**: LIKE is case-sensitive, limiting search effectiveness

#### ✅ **Optimized Solution**:
```typescript
// Uses trigram index + single aggregated query
const products = await this.productRepository
  .createQueryBuilder('product')
  .select([
    'product.id',
    'product.name', 
    'product.price',
    'COUNT(orderItem.id) as orderCount'
  ])
  .leftJoin('product.orderItems', 'orderItem')
  .where('product.name ILIKE :search', { search: `%${term}%` })
  .groupBy('product.id')
  .getRawMany();
```

#### 📊 **Performance Impact**: 60-95% improvement with proper indexing

---

### 3. Memory-Heavy Statistics Calculations

#### ❌ **Bad Pattern**:
```typescript
// Loads all data into memory for calculations
const orders = await this.orderRepository.find();
const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
const avgOrderValue = totalRevenue / orders.length;

for (const category of categories) {
  const categoryProducts = await this.productRepository.find({
    where: { categoryId: category.id }
  });
  // More calculations in memory...
}
```

#### 🚨 **Why It's Bad**:
- **Memory Consumption**: Loads entire dataset into application memory
- **Network Transfer**: Transfers unnecessary data from database
- **CPU Usage**: Application does work that database can do more efficiently
- **Multiple Queries**: Separate query for each category/calculation

#### ✅ **Optimized Solution**:
```typescript
// Single aggregated query in database
const result = await this.dataSource.query(`
  WITH order_stats AS (
    SELECT
      COUNT(*) as total_orders,
      SUM(total::numeric) as total_revenue,
      AVG(total::numeric) as average_order_value
    FROM orders
  ),
  category_stats AS (
    SELECT
      c.name as category,
      SUM(oi.unit_price * oi.quantity) as revenue,
      COUNT(DISTINCT p.id) as product_count
    FROM categories c
    JOIN products p ON c.id = p.category_id
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY c.id, c.name
  )
  SELECT * FROM order_stats, category_stats
`);
```

#### 📊 **Performance Impact**: 70-99% improvement, 1 query vs 100+ queries

---

### 4. Inefficient Pagination

#### ❌ **Bad Pattern**:
```typescript
// OFFSET-based pagination - performance degrades with page number
const orders = await this.orderRepository.find({
  skip: (page - 1) * pageSize,  // OFFSET becomes slower
  take: pageSize,
  order: { createdAt: 'DESC' }
});

const total = await this.orderRepository.count(); // Separate count query
```

#### 🚨 **Why It's Bad**:
- **OFFSET Performance**: Database must scan and skip records, slower for high page numbers
- **Separate Count Query**: Additional query just for pagination metadata
- **Inconsistent Results**: Data can shift between pages if new records are added
- **Memory Usage**: Database processes more records than needed

#### ✅ **Optimized Solution**:
```typescript
// Cursor-based pagination - consistent performance
const orders = await this.orderRepository
  .createQueryBuilder('order')
  .where('order.createdAt < :cursor', { cursor: lastCursor })
  .orderBy('order.createdAt', 'DESC')
  .take(pageSize + 1) // +1 to check if more records exist
  .getMany();

const hasMore = orders.length > pageSize;
if (hasMore) orders.pop(); // Remove extra record
```

#### 📊 **Performance Impact**: 60-90% improvement for large datasets

---

### 5. SQL Injection Vulnerabilities

#### ❌ **Bad Pattern**:
```typescript
// String concatenation - vulnerable to SQL injection
const unsafeQuery = `
  SELECT * FROM products 
  WHERE name LIKE '%${userInput}%' 
  AND price > ${minPrice}
`;
const result = await this.dataSource.query(unsafeQuery);
```

#### 🚨 **Why It's Bad**:
- **Security Risk**: Allows malicious SQL injection attacks
- **Data Breach**: Attackers can access unauthorized data
- **System Compromise**: Potential for data manipulation or deletion
- **Compliance Issues**: Violates security best practices and regulations

#### ✅ **Optimized Solution**:
```typescript
// Parameterized queries - safe from SQL injection
const safeQuery = `
  SELECT * FROM products 
  WHERE name ILIKE $1 
  AND price > $2
`;
const result = await this.dataSource.query(safeQuery, [
  `%${userInput}%`, 
  minPrice
]);

// Or using Query Builder (recommended)
const products = await this.productRepository
  .createQueryBuilder('product')
  .where('product.name ILIKE :term', { term: `%${userInput}%` })
  .andWhere('product.price > :minPrice', { minPrice })
  .getMany();
```

#### 📊 **Security Impact**: 100% protection against SQL injection attacks

## 🎯 Learning Objectives

Setelah menjalankan demo ini, Anda akan memahami:

1. **Query Optimization Techniques**:
   - Cara mengidentifikasi N+1 problems
   - Kapan menggunakan JOINs vs multiple queries
   - Strategi pagination yang scalable

2. **Performance Analysis**:
   - Menggunakan EXPLAIN ANALYZE untuk debugging
   - Membaca execution plans PostgreSQL
   - Benchmark methodology yang proper

3. **Security Best Practices**:
   - SQL injection prevention techniques
   - Safe raw query patterns dalam NestJS
   - ORM security considerations

4. **Database Design Impact**:
   - Pentingnya proper indexing
   - Trade-offs antara normalization vs performance
   - Kapan menggunakan database aggregation vs application logic

## 📚 Struktur Project

```
src/
├── entities/           # TypeORM entities dengan proper relationships
├── performance/        # Core demo services
│   ├── bad-queries.service.ts        # Anti-pattern demonstrations
│   ├── optimized-queries.service.ts  # Optimized implementations
│   ├── benchmark.service.ts          # Performance comparison
│   └── explain-analyze.service.ts    # PostgreSQL analysis
├── seeds/             # Large dataset seeder
└── app.controller.ts  # REST API endpoints
```

## 🔧 Technical Implementation

- **Framework**: NestJS + TypeORM
- **Database**: PostgreSQL (via Docker)
- **ORM Features**: Query Builder, Repository Pattern, Raw Queries
- **Testing**: Large dataset (850K+ records) untuk realistic scenarios
- **Monitoring**: Query logging, execution time tracking, statistical analysis

## 📊 Expected Results

Typical performance improvements yang bisa dilihat:

- **N+1 Problem**: 50-90% faster dengan proper JOINs
- **Search Queries**: 60-95% improvement dengan indexing
- **Statistics**: 70-99% faster dengan database aggregation
- **Query Count**: Reduction dari 50+ queries menjadi 1-3 queries

## 🚨 Important Notes

1. **Seed data terlebih dahulu** untuk hasil yang realistic
2. **Monitor memory usage** saat testing dengan dataset besar
3. **Check PostgreSQL logs** untuk melihat actual SQL queries
4. **Run benchmark multiple times** untuk hasil yang konsisten

---

**🎓 Bagian dari TypeScript Advanced Database Integration Tutorial - Day 3**

Demo ini adalah implementasi lengkap dari request spesifik user untuk optimasi query dengan pendekatan hands-on, data realistic, dan analisis performa yang mendalam.