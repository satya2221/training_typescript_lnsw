import { IsString, IsNumber, IsOptional, IsArray, IsObject, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePriceInfoDto {
  @IsNumber()
  @Min(0)
  current: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  original?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercent?: number;

  @IsOptional()
  validUntil?: Date;
}

export class CreateInventoryInfoDto {
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsEnum(['available', 'discontinued', 'out_of_stock'])
  status?: 'available' | 'discontinued' | 'out_of_stock';

  @IsOptional()
  lastRestocked?: Date;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => CreatePriceInfoDto)
  pricing: CreatePriceInfoDto;

  @ValidateNested()
  @Type(() => CreateInventoryInfoDto)
  inventory: CreateInventoryInfoDto;

  @IsString()
  categoryId: string; // Will be converted to ObjectId

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}