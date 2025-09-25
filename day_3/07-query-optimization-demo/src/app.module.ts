import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { BadQueriesService } from './performance/bad-queries.service';
import { OptimizedQueriesService } from './performance/optimized-queries.service';
import { ExplainAnalyzeService } from './performance/explain-analyze.service';
import { BenchmarkService } from './performance/benchmark.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432') || 5432,
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'inventory',
      // schema: 'query_optimization', // Using public schema for faster testing
      entities: [User, Product, Category, Order, OrderItem],
      synchronize: true,
      logging: ['query', 'error'],
    }),
    TypeOrmModule.forFeature([User, Product, Category, Order, OrderItem]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BadQueriesService,
    OptimizedQueriesService,
    ExplainAnalyzeService,
    BenchmarkService,
  ],
})
export class AppModule {}
