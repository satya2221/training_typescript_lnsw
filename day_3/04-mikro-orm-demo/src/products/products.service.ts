import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly em: EntityManager,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const em = this.em.fork();
    
    // Find category first
    const category = await em.findOneOrFail(Category, { id: createProductDto.categoryId });
    
    // Create product manually
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.sku = createProductDto.sku;
    product.status = createProductDto.status || 'active' as any;
    product.category = category as any;
    product.tags = createProductDto.tags;
    product.attributes = createProductDto.attributes;
    
    await em.persistAndFlush(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const em = this.em.fork();
    return em.find(Product, {}, { populate: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    const em = this.em.fork();
    const product = await em.findOne(Product, { id }, { populate: ['category'] });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const em = this.em.fork();
    const product = await em.findOneOrFail(Product, { id });
    
    em.assign(product, updateProductDto);
    await em.flush();
    
    return product;
  }

  async remove(id: number): Promise<void> {
    const em = this.em.fork();
    const product = await em.findOneOrFail(Product, { id });
    await em.removeAndFlush(product);
  }
}