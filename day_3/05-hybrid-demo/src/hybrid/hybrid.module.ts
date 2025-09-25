import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HybridController } from './hybrid.controller';
import { HybridService } from './hybrid.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Review, ReviewSchema } from '../schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
    ], 'mongodb'),
  ],
  controllers: [HybridController],
  providers: [HybridService, PrismaService],
  exports: [HybridService],
})
export class HybridModule {}