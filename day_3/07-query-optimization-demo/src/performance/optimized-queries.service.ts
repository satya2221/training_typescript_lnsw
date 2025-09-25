import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OptimizedQueriesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource
  ) {}

  // ✅ GOOD: Single query with JOIN - Fixes N+1 problem
  async getUsersWithOrdersOptimized(limit: number = 100) {
    console.log('⚡ Running OPTIMIZED query: Single JOIN to fix N+1');
    const startTime = Date.now();

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .take(limit)
      .getMany();

    const endTime = Date.now();
    console.log(`⚡ Optimized query took: ${endTime - startTime}ms for ${users.length} users`);

    return {
      executionTime: endTime - startTime,
      queryCount: 1, // Single query with JOIN
      results: users
    };
  }

  // ✅ GOOD: Indexed search with proper LIKE optimization
  async searchProductsByNameOptimized(searchTerm: string, limit: number = 50) {
    console.log('⚡ Running OPTIMIZED query: Indexed search with trigrams');
    const startTime = Date.now();

    // Using indexed search with proper pattern matching
    const products = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.quantity',
        'category.name'
      ])
      .leftJoin('product.category', 'category')
      .where('product.name ILIKE :search', { search: `%${searchTerm}%` })
      .orderBy('product.price', 'DESC')
      .addOrderBy('product.name', 'ASC')
      .take(limit)
      .getMany();

    const endTime = Date.now();
    console.log(`⚡ Optimized search took: ${endTime - startTime}ms for term: ${searchTerm}`);

    return {
      executionTime: endTime - startTime,
      resultCount: products.length,
      indexUsed: 'idx_products_name_trgm (trigram index)',
      results: products
    };
  }

  // ✅ GOOD: Single aggregation query - Efficient statistics
  async getOrderStatisticsOptimized() {
    console.log('⚡ Running OPTIMIZED query: Single aggregation query');
    const startTime = Date.now();

    // Single efficient query with CTEs for complex statistics
    const result = await this.dataSource.query(`
      WITH order_stats AS (
        SELECT
          COUNT(*) as total_orders,
          SUM(total::numeric) as total_revenue,
          AVG(total::numeric) as average_order_value
        FROM orders
      ),
      user_order_counts AS (
        SELECT
          u.id,
          u.name,
          u.email,
          COUNT(o.id) as order_count,
          SUM(o.total::numeric) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id, u.name, u.email
        ORDER BY order_count DESC, total_spent DESC
        LIMIT 10
      )
      SELECT
        (SELECT total_orders FROM order_stats) as "totalOrders",
        (SELECT total_revenue FROM order_stats) as "totalRevenue",
        (SELECT average_order_value FROM order_stats) as "averageOrderValue",
        json_agg(
          json_build_object(
            'id', id,
            'name', name,
            'email', email,
            'orderCount', order_count,
            'totalSpent', total_spent
          )
        ) as "topUsers"
      FROM user_order_counts
    `);

    const endTime = Date.now();
    console.log(`⚡ Optimized statistics took: ${endTime - startTime}ms`);

    return {
      executionTime: endTime - startTime,
      queryCount: 1, // Single CTE query
      results: result[0]
    };
  }

  // ✅ GOOD: Selective column loading - Only necessary data
  async getProductsWithCategoriesOptimized(limit: number = 100) {
    console.log('⚡ Running OPTIMIZED query: Selective column loading');
    const startTime = Date.now();

    const products = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.quantity',
        'category.id',
        'category.name'
      ])
      .leftJoin('product.category', 'category')
      .orderBy('product.price', 'DESC')
      .take(limit)
      .getMany();

    const endTime = Date.now();
    console.log(`⚡ Optimized product loading took: ${endTime - startTime}ms`);

    return {
      executionTime: endTime - startTime,
      resultCount: products.length,
      optimization: 'Selective columns, no unnecessary JOINs',
      results: products
    };
  }

  // ✅ GOOD: Parameterized queries - SQL injection safe
  async searchProductsSafe(searchTerm: string, minPrice?: number, maxPrice?: number) {
    console.log('🔒 Running SAFE query: Parameterized to prevent SQL injection');
    const startTime = Date.now();

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.quantity',
        'category.name'
      ])
      .leftJoin('product.category', 'category')
      .where('product.name ILIKE :search', { search: `%${searchTerm}%` });

    // Dynamic safe parameter binding
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const results = await queryBuilder
      .orderBy('product.rating', 'DESC')
      .limit(20)
      .getMany();

    const endTime = Date.now();
    console.log(`🔒 Safe search took: ${endTime - startTime}ms`);

    return {
      executionTime: endTime - startTime,
      securityNote: 'Using parameterized queries - SQL injection safe',
      searchTerm,
      priceRange: { min: minPrice, max: maxPrice },
      results
    };
  }

  // ✅ GOOD: Cursor-based pagination - Efficient for large offsets
  async getPaginatedOrdersOptimized(
    cursor?: Date,
    pageSize: number = 20,
    direction: 'next' | 'prev' = 'next'
  ) {
    console.log('⚡ Running OPTIMIZED query: Cursor-based pagination');
    const startTime = Date.now();

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.id',
        'order.total',
        'order.status',
        'order.createdAt',
        'user.id',
        'user.name'
      ])
      .leftJoin('order.user', 'user')
      .orderBy('order.createdAt', direction === 'next' ? 'DESC' : 'ASC')
      .limit(pageSize + 1); // +1 to check if there are more pages

    if (cursor) {
      const operator = direction === 'next' ? '<' : '>';
      queryBuilder.andWhere(`order.createdAt ${operator} :cursor`, { cursor });
    }

    const orders = await queryBuilder.getMany();
    const hasMore = orders.length > pageSize;
    const results = hasMore ? orders.slice(0, pageSize) : orders;
    const nextCursor = results.length > 0 ? results[results.length - 1].createdAt : null;

    const endTime = Date.now();
    console.log(`⚡ Cursor pagination took: ${endTime - startTime}ms`);

    return {
      executionTime: endTime - startTime,
      currentCursor: cursor,
      nextCursor,
      hasMore,
      pageSize: results.length,
      optimization: 'Cursor-based - no OFFSET needed',
      results
    };
  }

  // ✅ GOOD: Efficient JOIN with proper indexing
  async getOrdersWithItemsOptimized(limit: number = 10) {
    console.log('⚡ Running OPTIMIZED query: Efficient JOINs with batching');
    const startTime = Date.now();

    // Use two optimized queries instead of one complex query prone to cartesian products
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.id',
        'order.total',
        'order.status',
        'order.createdAt',
        'user.name'
      ])
      .leftJoin('order.user', 'user')
      .orderBy('order.createdAt', 'DESC')
      .take(limit)
      .getMany();

    const orderIds = orders.map(order => order.id);

    // Batch fetch order items
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select([
        'orderItem.orderId',
        'orderItem.quantity',
        'orderItem.unitPrice',
        'product.id',
        'product.name',
        'product.price'
      ])
      .leftJoin('orderItem.product', 'product')
      .where('orderItem.orderId IN (:...orderIds)', { orderIds })
      .getMany();

    // Group items by order
    const itemsByOrder = orderItems.reduce((acc, item) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push(item);
      return acc;
    }, {});

    // Combine results
    const ordersWithItems = orders.map(order => ({
      ...order,
      orderItems: itemsByOrder[order.id] || []
    }));

    const endTime = Date.now();
    console.log(`⚡ Optimized join took: ${endTime - startTime}ms`);

    return {
      executionTime: endTime - startTime,
      resultCount: orders.length,
      optimization: 'Two optimized queries, no cartesian product',
      results: ordersWithItems
    };
  }

  // Get all optimized query examples for comparison
  async runAllOptimizedQueries() {
    console.log('⚡ Running ALL optimized queries for demonstration...');

    const results = {
      joinOptimization: await this.getUsersWithOrdersOptimized(50),
      indexedSearch: await this.searchProductsByNameOptimized('laptop', 30),
      singleAggregation: await this.getOrderStatisticsOptimized(),
      selectiveLoading: await this.getProductsWithCategoriesOptimized(30),
      parameterizedQuery: await this.searchProductsSafe('phone', 100, 1000),
      cursorPagination: await this.getPaginatedOrdersOptimized(undefined, 10),
      efficientJoins: await this.getOrdersWithItemsOptimized(5)
    };

    const totalTime = Object.values(results).reduce((sum, result) =>
      sum + (result.executionTime || 0), 0
    );

    return {
      summary: {
        totalExecutionTime: totalTime,
        totalQueries: 7,
        averageTime: Math.round(totalTime / 7)
      },
      details: results
    };
  }
}