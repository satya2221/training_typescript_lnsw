import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {CacheModule, CacheInterceptor} from '@nestjs/cache-manager'
import { createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/Users';
import { Categories } from './entities/Categories';
import { Products } from './entities/Products';
import { Orders } from './entities/Orders';
import { OrderItems } from './entities/OrderItems';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    CacheModule.registerAsync({
      useFactory: async() =>({
        stores:[createKeyv(process.env.REDIS_URL)],
        ttl:360*1000
      }),
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || '',
      schema: process.env.DB_SCHEMA || '',
      entities: [Users, Categories, Products, Orders, OrderItems],
      synchronize: false,
      logging: ['query'],
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
