import { IsString, IsNumber, IsOptional, IsArray, IsObject } from 'class-validator';
import { ProductStatus } from '../../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsObject()
  attributes?: any;
}