// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
    @ApiProperty({ example: 'Wireless Keyboard', description: 'The name of the product' })
    @IsString() @IsNotEmpty() name: string;

    @ApiProperty() @IsString() @IsNotEmpty() brand: string;

    @ApiProperty({ example: 500000 })
    @IsNumber() @Min(0) price: number;

    @ApiProperty({ example: 10 })
    @IsNumber() @Min(0) quantity: number;

    @ApiProperty({ enum: ProductCategory })
    @IsEnum(ProductCategory) category: ProductCategory;
}