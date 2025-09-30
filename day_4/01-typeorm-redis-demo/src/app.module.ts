import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {User} from './entities/user.entity';
import {Category} from './entities/category.entity';
import {Product} from './entities/product.entity';
import {Order} from './entities/order.entity';
import {OrderItem} from './entities/order-item.entity';
import {ProductsModule} from './products/products.module';
import {CacheModule, CacheInterceptor} from "@nestjs/cache-manager";
import { createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
                db: 0,
                //password: 'redispassword123',
            },
        }),
        CacheModule.registerAsync({
            useFactory: async () => ({
                stores: [createKeyv('redis://@localhost:6379/0')],
                ttl: 60 * 1000, // Time-to-live default dalam milidetik (60 detik)
            }),
            isGlobal: true, // Membuat cache manager tersedia di seluruh aplikasi
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'myuser',
            password: process.env.DB_PASSWORD || '#Srondol[Y7]',
            database: process.env.DB_DATABASE || 'mydb',
            schema: process.env.DB_SCHEMA || 'public', // Use separate schema to avoid conflicts
            entities: [User, Category, Product, Order, OrderItem],
            synchronize: false, // Only for demo - use migrations in production
            logging: ['query'], // Enable query logging for demo
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
export class AppModule {
}
