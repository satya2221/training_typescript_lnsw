import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { OrderItem } from '../entities/order-item.entity';

export interface QueryResult {
  data: any;
  executionTime: number;
  queryCount: number;
  metadata: {
    description: string;
    problem: string;
    impact: string;
  };
}

@Injectable()
export class BadQueriesService {
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
  ) {}

  async getUsersWithOrdersBad(limit: number = 50): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: N+1 Query Problem - Loading users first, then orders for each user
    const users = await this.userRepository.find({
      take: limit
    });
    queryCount++;

    // This creates N additional queries (one for each user)
    const usersWithOrders = [] as any[];
    for (const user of users) {
      const orders = await this.orderRepository.find({
        where: { user: { id: user.id } },
        relations: ['items', 'items.product']
      });
      queryCount++;

      usersWithOrders.push({
        ...user,
        orders,
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0)
      });
    }

    const executionTime = Date.now() - startTime;

    return {
      data: usersWithOrders,
      executionTime,
      queryCount,
      metadata: {
        description: 'Loading users with their orders using N+1 query pattern',
        problem: 'Executes 1 query to get users, then N queries to get orders for each user',
        impact: `Generated ${queryCount} database queries instead of 1-2 optimized queries`
      }
    };
  }

  async searchProductsByNameBad(searchTerm: string, limit: number = 30): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: Using LIKE instead of indexed full-text search
    // BAD: No index on product name column
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('LOWER(product.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`
      })
      .orWhere('LOWER(product.description) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`
      })
      .take(limit);

    const products = await query.getMany();
    queryCount++;

    // BAD: Additional queries for each product to get related data
    const productsWithStats = [] as any[];
    // Limit to prevent infinite loop in demo
    const limitedProducts = products.slice(0, Math.min(products.length, 10));
    
    for (const product of limitedProducts) {
      // Get order count for this product (N+1 problem again)
      const orderCount = await this.orderItemRepository.count({
        where: { product: { id: product.id } }
      });
      queryCount++;

      // Get average rating (another query per product)
      const avgRating = Math.random() * 5; // Simulated since we don't have reviews table
      queryCount++;

      productsWithStats.push({
        ...product,
        orderCount,
        avgRating: Math.round(avgRating * 10) / 10
      });
    }

    const executionTime = Date.now() - startTime;

    return {
      data: productsWithStats,
      executionTime,
      queryCount,
      metadata: {
        description: 'Product search using inefficient LIKE queries and N+1 pattern',
        problem: 'Uses LIKE instead of full-text search, creates additional queries per product',
        impact: `No indexes utilized, ${queryCount} queries for ${products.length} products`
      }
    };
  }

  async getOrderStatisticsBad(): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: Multiple separate queries instead of aggregation
    const totalOrders = await this.orderRepository.count();
    queryCount++;

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .getRawOne();
    queryCount++;

    // BAD: Loading all orders to calculate average in memory
    const allOrders = await this.orderRepository.find();
    queryCount++;

    const averageOrderValue = allOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) / allOrders.length;

    // BAD: Separate query for each category
    const categories = await this.categoryRepository.find();
    queryCount++;

    const categoryStats = [] as any[];
    // Limit categories to prevent infinite loop in demo
    const limitedCategories = categories.slice(0, Math.min(categories.length, 20));
    
    for (const category of limitedCategories) {
      const categoryProducts = await this.productRepository.find({
        where: { category: { id: category.id } }
      });
      queryCount++;

      let categoryRevenue = 0;
      // Limit products per category to prevent excessive queries
      const limitedProducts = categoryProducts.slice(0, Math.min(categoryProducts.length, 5));
      
      for (const product of limitedProducts) {
        const productOrders = await this.orderItemRepository.find({
          where: { product: { id: product.id } },
          relations: ['order']
        });
        queryCount++;

        categoryRevenue += productOrders.reduce((sum, item) =>
          sum + (parseFloat(item.quantity.toString()) * parseFloat(item.unitPrice.toString())), 0
        );
      }

      categoryStats.push({
        category: category.name,
        revenue: categoryRevenue,
        productCount: categoryProducts.length
      });
    }

    const executionTime = Date.now() - startTime;

    return {
      data: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.total) || 0,
        averageOrderValue,
        categoryStats,
        timestamp: new Date().toISOString()
      },
      executionTime,
      queryCount,
      metadata: {
        description: 'Order statistics calculated using multiple inefficient queries',
        problem: 'Loads entire datasets in memory, uses nested loops with database queries',
        impact: `Executed ${queryCount} queries, processed ${allOrders.length} orders in memory`
      }
    };
  }

  async demonstrateSQLInjection(userInput: string): Promise<QueryResult> {
    const startTime = Date.now();

    // BAD: SQL Injection vulnerability - never do this!
    // This is intentionally vulnerable for demonstration purposes
    const unsafeQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.categoryId = c.id
      WHERE p.name LIKE '%${userInput}%'
      LIMIT 10
    `;

    try {
      // Execute the unsafe query (this would be dangerous in production)
      const result = await this.productRepository.manager.query(unsafeQuery);

      const executionTime = Date.now() - startTime;

      return {
        data: result,
        executionTime,
        queryCount: 1,
        metadata: {
          description: 'Vulnerable SQL query demonstrating injection risks',
          problem: 'Direct string interpolation allows SQL injection attacks',
          impact: `Query: ${unsafeQuery} - Input "${userInput}" could contain malicious SQL`
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        data: [],
        executionTime,
        queryCount: 1,
        metadata: {
          description: 'SQL injection attempt detected (query failed)',
          problem: 'Malicious input caused SQL syntax error',
          impact: `Error: ${error.message} - This demonstrates why parameterized queries are essential`
        }
      };
    }
  }

  async inefficientPagination(page: number = 1, pageSize: number = 20): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: Using OFFSET for pagination (gets slower with higher page numbers)
    const offset = (page - 1) * pageSize;

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'ASC')
      .skip(offset)  // BAD: OFFSET becomes inefficient for large offsets
      .take(pageSize)
      .getMany();
    queryCount++;

    // BAD: Separate count query
    const total = await this.productRepository.count();
    queryCount++;

    const executionTime = Date.now() - startTime;

    return {
      data: {
        products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          offset
        }
      },
      executionTime,
      queryCount,
      metadata: {
        description: 'Inefficient offset-based pagination',
        problem: 'OFFSET becomes slower as page number increases, separate count query',
        impact: `Page ${page} with offset ${offset} - performance degrades linearly with page number`
      }
    };
  }

  // Missing method referenced in benchmark
  async getProductsWithCategoriesBad(limit: number = 30): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: N+1 Problem - Load products first, then category for each product
    const products = await this.productRepository.find({
      take: Math.min(limit, 10) // Limit to prevent excessive queries in demo
    });
    queryCount++;

    const productsWithCategories = [] as any[];
    // Further limit to prevent timeout in demo environment
    const limitedProducts = products.slice(0, Math.min(products.length, 5));
    
    for (const product of limitedProducts) {
      // Additional query for each product's category
      const category = await this.categoryRepository.findOne({
        where: { id: product.categoryId }
      });
      queryCount++;

      productsWithCategories.push({
        ...product,
        categoryName: category?.name || 'Unknown'
      });
    }

    const executionTime = Date.now() - startTime;

    return {
      data: productsWithCategories,
      executionTime,
      queryCount,
      metadata: {
        description: 'Products with categories loaded using N+1 queries',
        problem: 'Separate query for each product\'s category',
        impact: `${queryCount} queries executed instead of 1-2 optimized queries`
      }
    };
  }

  // Missing method referenced in benchmark
  async getPaginatedOrdersBad(limit: number = 100, page: number = 1): Promise<QueryResult> {
    const startTime = Date.now();
    let queryCount = 0;

    // BAD: Load all orders then manually paginate (inefficient for large datasets)
    const allOrders = await this.orderRepository.find({
      relations: ['user']
    });
    queryCount++;

    // Manual pagination after loading all data
    const offset = (page - 1) * limit;
    const paginatedOrders = allOrders.slice(offset, offset + limit);

    // BAD: Additional queries for order items for each order
    const ordersWithItems = [] as any[];
    for (const order of paginatedOrders) {
      const items = await this.orderItemRepository.find({
        where: { orderId: order.id },
        relations: ['product']
      });
      queryCount++;

      ordersWithItems.push({
        ...order,
        itemCount: items.length,
        items: items
      });
    }

    const executionTime = Date.now() - startTime;

    return {
      data: ordersWithItems,
      executionTime,
      queryCount,
      metadata: {
        description: 'Paginated orders loaded inefficiently',
        problem: 'Loads all orders then paginates manually, plus N+1 for order items',
        impact: `Loaded ${allOrders.length} orders to show ${paginatedOrders.length}, with ${queryCount} total queries`
      }
    };
  }

  async runAllBadQueries(): Promise<{
    summary: string;
    totalExecutionTime: number;
    totalQueries: number;
    results: { [key: string]: QueryResult };
  }> {
    console.log('🐌 Running all BAD query examples...');

    const results: { [key: string]: QueryResult } = {};
    let totalExecutionTime = 0;
    let totalQueries = 0;

    // Run all bad query examples
    results.n1Problem = await this.getUsersWithOrdersBad(20);
    results.inefficientSearch = await this.searchProductsByNameBad('laptop', 15);
    results.badStatistics = await this.getOrderStatisticsBad();
    results.sqlInjectionDemo = await this.demonstrateSQLInjection("'; DROP TABLE products; --");
    results.badPagination = await this.inefficientPagination(10, 20);

    // Calculate totals
    Object.values(results).forEach(result => {
      totalExecutionTime += result.executionTime;
      totalQueries += result.queryCount;
    });

    return {
      summary: 'Demonstration of common query performance anti-patterns',
      totalExecutionTime,
      totalQueries,
      results
    };
  }
}