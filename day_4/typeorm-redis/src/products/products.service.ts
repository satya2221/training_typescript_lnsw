import { Injectable, Inject } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
