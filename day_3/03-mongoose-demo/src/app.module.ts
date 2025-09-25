import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { User, UserSchema } from './schemas/user.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017,localhost:27018,localhost:27019/inventory_mongo?replicaSet=rs0&directConnection=false',
      {
        connectionFactory: (connection) => {
          console.log('🔗 Connecting to MongoDB database...');
          connection.on('connected', () => {
            console.log('✅ MongoDB database connected successfully');
          });
          connection.on('error', (error) => {
            console.log('❌ MongoDB connection error:', error);
          });
          return connection;
        },
      }
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
