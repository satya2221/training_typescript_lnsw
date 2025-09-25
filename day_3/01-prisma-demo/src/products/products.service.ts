import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: createProductDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        orderItems: {
          include: {
            order: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Demo method: Low stock products
  async getLowStockProducts(threshold: number = 10) {
    return this.prisma.product.findMany({
      where: {
        quantity: {
          lte: threshold,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        quantity: 'asc',
      },
    });
  }
}
