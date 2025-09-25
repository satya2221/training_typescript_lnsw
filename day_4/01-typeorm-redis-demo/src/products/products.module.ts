import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity';
import {BullModule} from "@nestjs/bullmq";
import {ReportProcessor} from "./report.processor";

@Module({
  imports: [
      TypeOrmModule.forFeature([Product]),
      BullModule.registerQueue({
          name: 'report-queue', // Nama antrian kita
      }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ReportProcessor],
})
export class ProductsModule {}
