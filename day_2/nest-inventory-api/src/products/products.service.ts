import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Mouse',
      brand: 'Logitech',
      price: 250000,
      quantity: 15,
      category: ProductCategory.ELECTRONICS
    },
    {
      id: 2,
      name: 'USB Cable',
      brand: 'Anker',
      price: 75000,
      quantity: 30,
      category: ProductCategory.ACCESSORIES
    },
    {
      id: 3,
      name: 'Smartphone',
      brand: 'Samsung',
      price: 5000000,
      quantity: 8,
      category: ProductCategory.GADGETS
    }
  ];
  private nextId = 4;

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...updateProductDto
    };
    
    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number): { message: string } {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const removedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    
    return { message: `Product "${removedProduct.name}" has been successfully removed` };
  }

  // Additional utility methods for demo
  findByCategory(category: ProductCategory): Product[] {
    return this.products.filter(p => p.category === category);
  }

  findByBrand(brand: string): Product[] {
    return this.products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
  }

  getLowStockProducts(threshold: number = 10): Product[] {
    return this.products.filter(p => p.quantity <= threshold);
  }

  getTotalInventoryValue(): number {
    return this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }
}
