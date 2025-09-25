import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ComparisonService } from './comparison/comparison.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly comparisonService: ComparisonService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('comparison')
  getComparison() {
    return this.comparisonService.generateComparisonReport();
  }

  @Get('typeorm/entities')
  getTypeOrmEntities() {
    return {
      message: "TypeORM entities generated in src/generated/typeorm/",
      files: [
        "Products.ts - Complete product entity with relationships",
        "UserAccounts.ts - User management with profile relations",
        "CustomerOrders.ts - Order processing with payment tracking",
        "ProductCategories.ts - Hierarchical category structure",
        "CartItems.ts - Shopping cart with pricing calculations"
      ],
      example_location: "06-database-first-demo/src/generated/typeorm/Products.ts"
    };
  }

  @Get('prisma/schema')
  getPrismaSchema() {
    return {
      message: "Prisma schema generated in prisma/schema.prisma",
      models: 16,
      warnings: [
        "17 check constraints not supported by Prisma Client",
        "2 expression indexes not supported (GIN full-text search)"
      ],
      next_steps: [
        "Run 'npx prisma generate' to create Prisma Client",
        "Import PrismaClient in services for database operations",
        "Use Prisma Studio for database visualization: 'npx prisma studio'"
      ]
    };
  }
}
