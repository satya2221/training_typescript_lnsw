import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Convert categoryId string to ObjectId
      const productData = {
        ...createProductDto,
        categoryId: new Types.ObjectId(createProductDto.categoryId),
      };

      const createdProduct = new this.productModel(productData);
      const savedProduct = await createdProduct.save();

      // Return with populated category
      return this.productModel
        .findById(savedProduct._id)
        .populate('category')
        .exec() as Promise<Product>;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      if (error.message.includes('ObjectId')) {
        throw new BadRequestException(`Invalid categoryId format`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate('category')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    try {
      const updateData: any = { ...updateProductDto };

      // Convert categoryId string to ObjectId if provided
      if (updateProductDto.categoryId) {
        updateData.categoryId = new Types.ObjectId(updateProductDto.categoryId);
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('category')
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      if (error.message.includes('ObjectId')) {
        throw new BadRequestException(`Invalid categoryId format`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: `Product with ID ${id} has been successfully removed` };
  }

  // MongoDB-specific query methods showcasing NoSQL capabilities

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return this.productModel
      .find({
        'inventory.quantity': { $lte: threshold }
      })
      .populate('category')
      .sort({ 'inventory.quantity': 1 })
      .exec();
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productModel
      .find({
        $text: { $search: query }
      })
      .populate('category')
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  }

  async getProductsByTags(tags: string[]): Promise<Product[]> {
    return this.productModel
      .find({
        tags: { $in: tags }
      })
      .populate('category')
      .exec();
  }

  async getProductsInPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productModel
      .find({
        'pricing.current': { $gte: minPrice, $lte: maxPrice }
      })
      .populate('category')
      .sort({ 'pricing.current': 1 })
      .exec();
  }

  // Aggregation pipeline example - MongoDB's powerful feature
  async getProductStatsByCategory(): Promise<any[]> {
    return this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $group: {
            _id: '$category._id',
            categoryName: { $first: '$category.name' },
            productCount: { $sum: 1 },
            avgPrice: { $avg: '$pricing.current' },
            totalQuantity: { $sum: '$inventory.quantity' },
            minPrice: { $min: '$pricing.current' },
            maxPrice: { $max: '$pricing.current' }
          }
        },
        {
          $sort: { productCount: -1 }
        }
      ])
      .exec();
  }

  // Update inventory using atomic operations
  async updateInventory(id: string, quantityChange: number): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { 'inventory.quantity': quantityChange },
          $set: { 'inventory.lastRestocked': new Date() }
        },
        { new: true, runValidators: true }
      )
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}