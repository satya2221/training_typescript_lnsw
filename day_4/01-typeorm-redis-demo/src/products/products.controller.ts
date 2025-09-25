import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {CacheInterceptor, CacheKey, CacheTTL} from "@nestjs/cache-manager";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @UseInterceptors(CacheInterceptor) // <-- Aktifkan Interceptor di sini
    @CacheKey('all_products')          // <-- Beri kunci unik untuk cache ini
    @CacheTTL(300 * 1000)               // <-- Set TTL khusus untuk endpoint ini (300 detik = 5 menit)
    @Get()
    findAll() {
        console.log('--- Mengambil data dari DATABASE (findAll) ---'); // Tambahkan log ini
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
