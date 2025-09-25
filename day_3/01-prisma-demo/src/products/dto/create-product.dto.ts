import { IsString, IsNotEmpty, IsNumber, Min, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;
}
