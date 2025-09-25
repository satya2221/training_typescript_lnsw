import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { HybridService } from './hybrid.service';

@Controller('hybrid')
export class HybridController {
  constructor(private readonly hybridService: HybridService) {}

  @Get('test')
  test() {
    return { 
      message: 'Hybrid Demo API is working!', 
      timestamp: new Date(),
      databases: ['PostgreSQL (Prisma)', 'MongoDB (Mongoose)']
    };
  }

  @Get('orders/:id')
  getOrderWithProducts(@Param('id', ParseIntPipe) id: number) {
    return this.hybridService.getOrderWithProducts(id);
  }

  @Get('products/:id')
  getProductDetails(@Param('id') id: string) {
    return this.hybridService.getProductDetails(id);
  }

  @Post('orders')
  createOrder(@Body() createOrderDto: { userId: number; items: Array<{ productId: string; quantity: number }> }) {
    return this.hybridService.createOrder(createOrderDto.userId, createOrderDto.items);
  }

  @Get('users/:id/dashboard')
  getUserDashboard(@Param('id', ParseIntPipe) id: number) {
    return this.hybridService.getUserDashboard(id);
  }

  @Get('products')
  searchProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.hybridService.searchProducts({
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock === 'true',
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }
}