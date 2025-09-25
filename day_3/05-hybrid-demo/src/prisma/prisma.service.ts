import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma connected to PostgreSQL (hybrid_demo schema)');
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL:', error.message);
      console.log('⚠️  Continuing without PostgreSQL connection...');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Prisma disconnected from PostgreSQL');
  }

  // Helper method for transactions
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  // Helper method for raw queries
  async executeRaw(query: string, ...params: any[]) {
    return this.$executeRaw`${query}`;
  }

  // Helper method for query raw
  async queryRaw<T = any>(query: string, ...params: any[]): Promise<T[]> {
    return this.$queryRaw`${query}`;
  }
}