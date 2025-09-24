import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategory } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      const result = service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('brand');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('quantity');
      expect(result[0]).toHaveProperty('category');
    });

    it('should return products with correct initial data', () => {
      const result = service.findAll();
      expect(result[0].name).toBe('Wireless Mouse');
      expect(result[1].name).toBe('USB Cable');
      expect(result[2].name).toBe('Smartphone');
    });
  });

  describe('findOne', () => {
    it('should return a product when valid id is provided', () => {
      const result = service.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Wireless Mouse');
      expect(result.brand).toBe('Logitech');
    });

    it('should throw NotFoundException when product does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Product with ID 999 not found');
    });

    it('should return correct product for each existing id', () => {
      const product1 = service.findOne(1);
      const product2 = service.findOne(2);
      const product3 = service.findOne(3);

      expect(product1.name).toBe('Wireless Mouse');
      expect(product2.name).toBe('USB Cable');
      expect(product3.name).toBe('Smartphone');
    });
  });

  describe('create', () => {
    it('should create a new product with auto-generated id', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ELECTRONICS
      };

      const result = service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(4); // Next available ID
      expect(result.name).toBe('Test Product');
      expect(result.brand).toBe('Test Brand');
      expect(result.price).toBe(100000);
      expect(result.quantity).toBe(10);
      expect(result.category).toBe(ProductCategory.ELECTRONICS);
    });

    it('should create product with valid salePrice less than price', () => {
      const createProductDto: CreateProductDto = {
        name: 'Sale Product',
        brand: 'Sale Brand',
        price: 150000,
        salePrice: 120000,
        quantity: 5,
        category: ProductCategory.ELECTRONICS
      };

      const result = service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.price).toBe(150000);
      expect(result.salePrice).toBe(120000);
      expect(result.name).toBe('Sale Product');
    });

    it('should create product with salePrice equal to price', () => {
      const createProductDto: CreateProductDto = {
        name: 'Equal Price Product',
        brand: 'Test Brand',
        price: 200000,
        salePrice: 200000,
        quantity: 8,
        category: ProductCategory.GADGETS
      };

      const result = service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.price).toBe(200000);
      expect(result.salePrice).toBe(200000);
    });

    it('should create product without salePrice', () => {
      const createProductDto: CreateProductDto = {
        name: 'No Sale Product',
        brand: 'Test Brand',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ACCESSORIES
      };

      const result = service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.price).toBe(100000);
      expect(result.salePrice).toBeUndefined();
    });

    it('should add the new product to the products array', () => {
      const initialCount = service.findAll().length;
      
      const createProductDto: CreateProductDto = {
        name: 'Another Product',
        brand: 'Another Brand',
        price: 200000,
        quantity: 5,
        category: ProductCategory.ACCESSORIES
      };

      service.create(createProductDto);
      const finalCount = service.findAll().length;

      expect(finalCount).toBe(initialCount + 1);
    });

    it('should increment id for each new product', () => {
      const dto1: CreateProductDto = {
        name: 'Product 1',
        brand: 'Brand 1',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ELECTRONICS
      };

      const dto2: CreateProductDto = {
        name: 'Product 2',
        brand: 'Brand 2',
        price: 200000,
        quantity: 20,
        category: ProductCategory.GADGETS
      };

      const result1 = service.create(dto1);
      const result2 = service.create(dto2);

      expect(result1.id).toBe(4);
      expect(result2.id).toBe(5);
    });
  });

  describe('update', () => {
    it('should update an existing product', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Mouse',
        price: 300000
      };

      const result = service.update(1, updateProductDto);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Updated Mouse');
      expect(result.price).toBe(300000);
      expect(result.brand).toBe('Logitech'); // Should remain unchanged
      expect(result.quantity).toBe(15); // Should remain unchanged
    });

    it('should throw NotFoundException when product does not exist', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product'
      };

      expect(() => service.update(999, updateProductDto)).toThrow(NotFoundException);
      expect(() => service.update(999, updateProductDto)).toThrow('Product with ID 999 not found');
    });

    it('should update only provided fields', () => {
      const updateProductDto: UpdateProductDto = {
        quantity: 50
      };

      const result = service.update(2, updateProductDto);

      expect(result.id).toBe(2);
      expect(result.name).toBe('USB Cable'); // Should remain unchanged
      expect(result.brand).toBe('Anker'); // Should remain unchanged
      expect(result.price).toBe(75000); // Should remain unchanged
      expect(result.quantity).toBe(50); // Should be updated
      expect(result.category).toBe(ProductCategory.ACCESSORIES); // Should remain unchanged
    });

    it('should update multiple fields at once', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Premium Smartphone',
        price: 6000000,
        quantity: 12
      };

      const result = service.update(3, updateProductDto);

      expect(result.name).toBe('Premium Smartphone');
      expect(result.price).toBe(6000000);
      expect(result.quantity).toBe(12);
      expect(result.brand).toBe('Samsung'); // Should remain unchanged
    });

    it('should update product with valid salePrice less than price', () => {
      const updateProductDto: UpdateProductDto = {
        price: 300000,
        salePrice: 250000
      };

      const result = service.update(1, updateProductDto);

      expect(result.id).toBe(1);
      expect(result.price).toBe(300000);
      expect(result.salePrice).toBe(250000);
      expect(result.name).toBe('Wireless Mouse'); // Should remain unchanged
    });

    it('should update product with salePrice equal to price', () => {
      const updateProductDto: UpdateProductDto = {
        price: 400000,
        salePrice: 400000
      };

      const result = service.update(2, updateProductDto);

      expect(result.id).toBe(2);
      expect(result.price).toBe(400000);
      expect(result.salePrice).toBe(400000);
      expect(result.name).toBe('USB Cable'); // Should remain unchanged
    });

    it('should update product without salePrice field', () => {
      const updateProductDto: UpdateProductDto = {
        price: 500000
      };

      const result = service.update(1, updateProductDto);

      expect(result.id).toBe(1);
      expect(result.price).toBe(500000);
      expect(result.salePrice).toBeUndefined();
      expect(result.name).toBe('Wireless Mouse'); // Should remain unchanged
    });

    it('should update only salePrice without changing price', () => {
      const updateProductDto: UpdateProductDto = {
        salePrice: 200000
      };

      const result = service.update(1, updateProductDto);

      expect(result.id).toBe(1);
      expect(result.price).toBe(250000); // Should remain unchanged from initial data
      expect(result.salePrice).toBe(200000);
      expect(result.name).toBe('Wireless Mouse'); // Should remain unchanged
    });
  });

  describe('remove', () => {
    it('should remove an existing product', () => {
      const initialCount = service.findAll().length;
      const result = service.remove(1);

      expect(result).toEqual({
        message: 'Product "Wireless Mouse" has been successfully removed'
      });

      const finalCount = service.findAll().length;
      expect(finalCount).toBe(initialCount - 1);
    });

    it('should throw NotFoundException when product does not exist', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Product with ID 999 not found');
    });

    it('should not be able to find removed product', () => {
      service.remove(2);
      expect(() => service.findOne(2)).toThrow(NotFoundException);
    });

    it('should return correct message with product name', () => {
      const result = service.remove(3);
      expect(result.message).toBe('Product "Smartphone" has been successfully removed');
    });
  });

  describe('findByCategory', () => {
    it('should return products filtered by category', () => {
      const electronicsProducts = service.findByCategory(ProductCategory.ELECTRONICS);
      const accessoriesProducts = service.findByCategory(ProductCategory.ACCESSORIES);
      const gadgetsProducts = service.findByCategory(ProductCategory.GADGETS);

      expect(electronicsProducts).toHaveLength(1);
      expect(electronicsProducts[0].name).toBe('Wireless Mouse');

      expect(accessoriesProducts).toHaveLength(1);
      expect(accessoriesProducts[0].name).toBe('USB Cable');

      expect(gadgetsProducts).toHaveLength(1);
      expect(gadgetsProducts[0].name).toBe('Smartphone');
    });

    it('should return empty array for category with no products', () => {
      // Remove all products and add one with different category
      service.remove(1);
      service.remove(2);
      service.remove(3);

      const result = service.findByCategory(ProductCategory.ELECTRONICS);
      expect(result).toHaveLength(0);
    });
  });

  describe('findByBrand', () => {
    it('should return products filtered by brand (case insensitive)', () => {
      const logitechProducts = service.findByBrand('Logitech');
      const ankerProducts = service.findByBrand('anker');
      const samsungProducts = service.findByBrand('SAMSUNG');

      expect(logitechProducts).toHaveLength(1);
      expect(logitechProducts[0].name).toBe('Wireless Mouse');

      expect(ankerProducts).toHaveLength(1);
      expect(ankerProducts[0].name).toBe('USB Cable');

      expect(samsungProducts).toHaveLength(1);
      expect(samsungProducts[0].name).toBe('Smartphone');
    });

    it('should return products with partial brand name match', () => {
      const result = service.findByBrand('Log');
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe('Logitech');
    });

    it('should return empty array for non-existent brand', () => {
      const result = service.findByBrand('NonExistentBrand');
      expect(result).toHaveLength(0);
    });
  });

  describe('getLowStockProducts', () => {
    it('should return products with quantity <= default threshold (10)', () => {
      const result = service.getLowStockProducts();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Smartphone');
      expect(result[0].quantity).toBe(8);
    });

    it('should return products with quantity <= custom threshold', () => {
      const result = service.getLowStockProducts(15);
      expect(result).toHaveLength(2);
      
      const productNames = result.map(p => p.name);
      expect(productNames).toContain('Wireless Mouse');
      expect(productNames).toContain('Smartphone');
    });

    it('should return empty array when no products are below threshold', () => {
      const result = service.getLowStockProducts(5);
      expect(result).toHaveLength(0);
    });

    it('should return all products when threshold is high', () => {
      const result = service.getLowStockProducts(50);
      expect(result).toHaveLength(3);
    });
  });

  describe('getTotalInventoryValue', () => {
    it('should calculate correct total inventory value', () => {
      const result = service.getTotalInventoryValue();
      
      // Expected calculation:
      // Wireless Mouse: 250000 * 15 = 3750000
      // USB Cable: 75000 * 30 = 2250000
      // Smartphone: 5000000 * 8 = 40000000
      // Total: 46000000
      
      expect(result).toBe(46000000);
    });

    it('should return 0 when no products exist', () => {
      // Remove all products
      service.remove(1);
      service.remove(2);
      service.remove(3);

      const result = service.getTotalInventoryValue();
      expect(result).toBe(0);
    });

    it('should update total value when products are added', () => {
      const initialValue = service.getTotalInventoryValue();

      const newProduct: CreateProductDto = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ELECTRONICS
      };

      service.create(newProduct);
      const newValue = service.getTotalInventoryValue();

      expect(newValue).toBe(initialValue + (100000 * 10));
    });

    it('should update total value when products are updated', () => {
      const initialValue = service.getTotalInventoryValue();

      // Update quantity of first product from 15 to 20
      service.update(1, { quantity: 20 });
      const newValue = service.getTotalInventoryValue();

      // Difference should be 250000 * (20 - 15) = 1250000
      expect(newValue).toBe(initialValue + 1250000);
    });
  });
});
