import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('🔗 Connecting to PostgreSQL database...');
    await this.$connect();
    console.log('✅ PostgreSQL database connected successfully');
  }

  async onModuleDestroy() {
    console.log('🔌 Disconnecting from PostgreSQL database...');
    await this.$disconnect();
    console.log('✅ PostgreSQL database disconnected successfully');
  }
}