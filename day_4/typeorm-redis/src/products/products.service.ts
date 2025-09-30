import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager";

import { Products } from 'src/entities/Products';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ){}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(): Promise<Products[]> {
    return this.productRepository.find({
      relations:['category'],
      order: {createdAt: 'DESC'}
    });
  }

  async findOne(id: number): Promise<Products> {
    const cacheKey = `product_${id}`;

    const cachedProduct = await this.cacheManager.get<Products>(cacheKey);
    if(cachedProduct){
      console.log(`--- Ambil dari cache untuk id :${id} ---`)
      return cachedProduct;
    }

    console.log("--- Ambil dari Database ---");
    const product = await this.productRepository.findOne({
      where: {id},
      relations:['category', 'orderItems', 'orderItems.order']
    })
    if(!product){
      throw new NotFoundException(`Product id: ${id} is not found`)
    }

    await this.cacheManager.set(cacheKey, product);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
