import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product} from '../entities/product.entity';
import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager";
import {Queue} from "bullmq";
import {InjectQueue} from "@nestjs/bullmq";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, // <-- Inject Cache Manager
        @InjectQueue('report-queue') private reportQueue: Queue, // Inject Queue
    ) {
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        try {
            const product = this.productRepository.create(createProductDto);
            const savedProduct = await this.productRepository.save(product);
            // Tambahkan ini di akhir method create, update, dan remove
            await this.cacheManager.del('all_products');

            // Tambahkan pekerjaan ke queue setelah produk dibuat
            await this.reportQueue.add('generate-report', {
                productId: savedProduct.id,
                requestedBy: 'admin@example.com',
            });

            // Return with relations
            return this.productRepository.findOne({
                where: {id: savedProduct.id},
                relations: ['category'],
            }) as Promise<Product>;
        } catch (error) {
            if (error.code === '23503') { // Foreign key constraint violation
                throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
            }
            throw error;
        }
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['category'],
            order: {createdAt: 'DESC'},
        });
    }

    async findOne(id: number): Promise<Product> {
        const cacheKey = `product_${id}`;
        // 1. Cek di cache dulu
        const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
        if (cachedProduct) {
            console.log(`--- Mengambil data dari CACHE (findOne: ${cacheKey}) ---`);
            return cachedProduct;
        }

        // 2. Jika tidak ada di cache (cache miss), ambil dari DB
        console.log(`--- Mengambil data dari DATABASE (findOne: ${id}) ---`);
        const product = await this.productRepository.findOne({
            where: {id},
            relations: ['category', 'orderItems', 'orderItems.order'],
        });
        if (!product) {
            throw new NotFoundException(`Product with ID #${id} not found`);
        }

        // 3. Simpan hasil ke cache sebelum mengembalikannya
        await this.cacheManager.set(cacheKey, product);

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            const cacheKey = `product_${id}`;

            const result = await this.productRepository.update(id, updateProductDto);

            // Hapus cache yang sudah tidak valid
            await this.cacheManager.del(cacheKey);
            // Tambahkan ini di akhir method create, update, dan remove
            await this.cacheManager.del('all_products');

            if (result.affected === 0) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            return this.productRepository.findOne({
                where: {id},
                relations: ['category'],
            }) as Promise<Product>;
        } catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
            }
            throw error;
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        const cacheKey = `product_${id}`;
        const result = await this.productRepository.delete(id);

        await this.cacheManager.del(cacheKey);
        // Tambahkan ini di akhir method create, update, dan remove
        await this.cacheManager.del('all_products');

        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return {message: `Product with ID ${id} has been successfully removed`};
    }

    // Demo method: Repository pattern with QueryBuilder
    async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
        return this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.quantity <= :threshold', {threshold})
            .orderBy('product.quantity', 'ASC')
            .getMany();
    }

    // Demo method: Raw query for complex operations
    async getProductStats(): Promise<any> {
        return this.productRepository
            .createQueryBuilder('product')
            .select([
                'category.name as categoryName',
                'COUNT(product.id) as productCount',
                'AVG(product.price) as avgPrice',
                'SUM(product.quantity) as totalQuantity'
            ])
            .leftJoin('product.category', 'category')
            .groupBy('category.id, category.name')
            .getRawMany();
    }
}
