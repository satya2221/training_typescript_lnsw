import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Creates a new product in the inventory system with the provided details'
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data to create',
    examples: {
      electronics: {
        summary: 'Electronics Product Example',
        value: {
          name: 'Wireless Keyboard',
          brand: 'Logitech',
          price: 500000,
          quantity: 25,
          category: 'ELEKTRONIK'
        }
      },
      accessories: {
        summary: 'Accessories Product Example',
        value: {
          name: 'Phone Case',
          brand: 'Spigen',
          price: 150000,
          quantity: 50,
          category: 'AKSESORIS'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: Product,
    example: {
      id: 4,
      name: 'Wireless Keyboard',
      brand: 'Logitech',
      price: 500000,
      quantity: 25,
      category: 'ELEKTRONIK'
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
    example: {
      statusCode: 400,
      message: ['name should not be empty', 'price must be a positive number'],
      error: 'Bad Request'
    }
  })
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all products',
    description: 'Retrieves a list of all products in the inventory'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [Product],
    example: [
      {
        id: 1,
        name: 'Wireless Mouse',
        brand: 'Logitech',
        price: 250000,
        quantity: 15,
        category: 'ELEKTRONIK'
      },
      {
        id: 2,
        name: 'USB Cable',
        brand: 'Anker',
        price: 75000,
        quantity: 30,
        category: 'AKSESORIS'
      }
    ]
  })
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product by ID',
    description: 'Retrieves a specific product by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the product',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: Product,
    example: {
      id: 1,
      name: 'Wireless Mouse',
      brand: 'Logitech',
      price: 250000,
      quantity: 15,
      category: 'ELEKTRONIK'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product with ID 999 not found',
      error: 'Not Found'
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number): Product {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update product',
    description: 'Updates an existing product with new information. All fields are optional.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the product to update',
    example: 1
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product data to update (all fields optional)',
    examples: {
      priceUpdate: {
        summary: 'Update Price Only',
        value: {
          price: 300000
        }
      },
      stockUpdate: {
        summary: 'Update Stock Quantity',
        value: {
          quantity: 50
        }
      },
      fullUpdate: {
        summary: 'Update Multiple Fields',
        value: {
          name: 'Premium Wireless Mouse',
          price: 350000,
          quantity: 20
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: Product,
    example: {
      id: 1,
      name: 'Premium Wireless Mouse',
      brand: 'Logitech',
      price: 350000,
      quantity: 20,
      category: 'ELEKTRONIK'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product with ID 999 not found',
      error: 'Not Found'
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
    example: {
      statusCode: 400,
      message: ['price must be a positive number'],
      error: 'Bad Request'
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Product {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete product',
    description: 'Removes a product from the inventory system permanently'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the product to delete',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
    example: {
      message: 'Product "Wireless Mouse" has been successfully removed'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product with ID 999 not found',
      error: 'Not Found'
    }
  })
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.productsService.remove(id);
  }
}
