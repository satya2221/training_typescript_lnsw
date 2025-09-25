import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  searchProducts(@Query('q') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('low-stock')
  getLowStockProducts(
    @Query('threshold', new DefaultValuePipe(10), ParseIntPipe) threshold: number,
  ) {
    return this.productsService.getLowStockProducts(threshold);
  }

  @Get('by-tags')
  getProductsByTags(@Query('tags') tags: string) {
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    return this.productsService.getProductsByTags(tagArray);
  }

  @Get('price-range')
  getProductsInPriceRange(
    @Query('min', ParseIntPipe) minPrice: number,
    @Query('max', ParseIntPipe) maxPrice: number,
  ) {
    return this.productsService.getProductsInPriceRange(minPrice, maxPrice);
  }

  @Get('stats/by-category')
  getProductStatsByCategory() {
    return this.productsService.getProductStatsByCategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/inventory')
  updateInventory(
    @Param('id') id: string,
    @Body('quantityChange', ParseIntPipe) quantityChange: number,
  ) {
    return this.productsService.updateInventory(id, quantityChange);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}