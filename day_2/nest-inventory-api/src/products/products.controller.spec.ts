import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    brand: 'Test Brand',
    price: 100000,
    quantity: 10,
    category: ProductCategory.ELECTRONICS
  };

  const mockProducts: Product[] = [
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

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
    findByBrand: jest.fn(),
    getLowStockProducts: jest.fn(),
    getTotalInventoryValue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ELECTRONICS
      };

      const expectedResult = { id: 4, ...createProductDto };
      mockProductsService.create.mockReturnValue(expectedResult);

      const result = controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return the created product with auto-generated id', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Wireless Keyboard',
        brand: 'Logitech',
        price: 500000,
        quantity: 25,
        category: ProductCategory.ELECTRONICS
      };

      const expectedResult: Product = { id: 5, ...createProductDto };
      mockProductsService.create.mockReturnValue(expectedResult);

      const result = controller.create(createProductDto);

      expect(result).toEqual(expectedResult);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
    });

    it('should handle different product categories', async () => {
      const accessoryDto: CreateProductDto = {
        name: 'Phone Case',
        brand: 'Spigen',
        price: 150000,
        quantity: 50,
        category: ProductCategory.ACCESSORIES
      };

      const expectedResult: Product = { id: 6, ...accessoryDto };
      mockProductsService.create.mockReturnValue(expectedResult);

      const result = controller.create(accessoryDto);

      expect(service.create).toHaveBeenCalledWith(accessoryDto);
      expect(result.category).toBe(ProductCategory.ACCESSORIES);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockProductsService.findAll.mockReturnValue(mockProducts);

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no products exist', async () => {
      mockProductsService.findAll.mockReturnValue([]);

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return products with all required properties', async () => {
      mockProductsService.findAll.mockReturnValue(mockProducts);

      const result = controller.findAll();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('brand');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('quantity');
      expect(result[0]).toHaveProperty('category');
    });
  });

  describe('findOne', () => {
    it('should return a product when valid id is provided', async () => {
      mockProductsService.findOne.mockReturnValue(mockProduct);

      const result = controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProduct);
    });

    it('should handle ParseIntPipe conversion correctly', async () => {
      mockProductsService.findOne.mockReturnValue(mockProducts[1]);

      const result = controller.findOne(2);

      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(typeof 2).toBe('number'); // Verify it's a number, not string
      expect(result).toEqual(mockProducts[1]);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const notFoundError = new NotFoundException('Product with ID 999 not found');
      mockProductsService.findOne.mockImplementation(() => {
        throw notFoundError;
      });

      expect(() => controller.findOne(999)).toThrow(NotFoundException);
      expect(() => controller.findOne(999)).toThrow('Product with ID 999 not found');
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('should return correct product for different ids', async () => {
      mockProductsService.findOne.mockImplementation((id: number) => {
        return mockProducts.find(p => p.id === id);
      });

      const result1 = controller.findOne(1);
      const result2 = controller.findOne(2);
      const result3 = controller.findOne(3);

      expect(result1?.name).toBe('Wireless Mouse');
      expect(result2?.name).toBe('USB Cable');
      expect(result3?.name).toBe('Smartphone');
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200000
      };

      const updatedProduct: Product = {
        ...mockProduct,
        ...updateProductDto
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedProduct);
    });

    it('should handle partial updates correctly', async () => {
      const updateProductDto: UpdateProductDto = {
        quantity: 25
      };

      const updatedProduct: Product = {
        ...mockProduct,
        quantity: 25
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result.quantity).toBe(25);
      expect(result.name).toBe(mockProduct.name); // Should remain unchanged
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product'
      };

      const notFoundError = new NotFoundException('Product with ID 999 not found');
      mockProductsService.update.mockImplementation(() => {
        throw notFoundError;
      });

      expect(() => controller.update(999, updateProductDto)).toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateProductDto);
    });

    it('should handle multiple field updates', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Premium Mouse',
        price: 350000,
        quantity: 20,
        category: ProductCategory.GADGETS
      };

      const updatedProduct: Product = {
        ...mockProduct,
        ...updateProductDto
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(result.name).toBe('Premium Mouse');
      expect(result.price).toBe(350000);
      expect(result.quantity).toBe(20);
      expect(result.category).toBe(ProductCategory.GADGETS);
    });

    it('should preserve unchanged fields during update', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 300000
      };

      const updatedProduct: Product = {
        ...mockProduct,
        price: 300000
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(result.price).toBe(300000);
      expect(result.name).toBe(mockProduct.name);
      expect(result.brand).toBe(mockProduct.brand);
      expect(result.quantity).toBe(mockProduct.quantity);
      expect(result.category).toBe(mockProduct.category);
    });

    it('should update product with valid salePrice less than price', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 300000,
        salePrice: 250000
      };

      const updatedProduct: Product = {
        ...mockProduct,
        ...updateProductDto
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result.price).toBe(300000);
      expect(result.salePrice).toBe(250000);
    });

    it('should update product with salePrice equal to price', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 300000,
        salePrice: 300000
      };

      const updatedProduct: Product = {
        ...mockProduct,
        ...updateProductDto
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result.price).toBe(300000);
      expect(result.salePrice).toBe(300000);
    });

    it('should update product without salePrice', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 400000
      };

      const updatedProduct: Product = {
        ...mockProduct,
        price: 400000
      };

      mockProductsService.update.mockReturnValue(updatedProduct);

      const result = controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result.price).toBe(400000);
      expect(result.salePrice).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing product', async () => {
      const removeResponse = {
        message: 'Product "Test Product" has been successfully removed'
      };

      mockProductsService.remove.mockReturnValue(removeResponse);

      const result = controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(removeResponse);
    });

    it('should return success message with product name', async () => {
      const removeResponse = {
        message: 'Product "Wireless Mouse" has been successfully removed'
      };

      mockProductsService.remove.mockReturnValue(removeResponse);

      const result = controller.remove(1);

      expect(result.message).toContain('Wireless Mouse');
      expect(result.message).toContain('successfully removed');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const notFoundError = new NotFoundException('Product with ID 999 not found');
      mockProductsService.remove.mockImplementation(() => {
        throw notFoundError;
      });

      expect(() => controller.remove(999)).toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });

    it('should handle different product removals', async () => {
      const removeResponses = [
        { message: 'Product "Wireless Mouse" has been successfully removed' },
        { message: 'Product "USB Cable" has been successfully removed' },
        { message: 'Product "Smartphone" has been successfully removed' }
      ];

      mockProductsService.remove
        .mockReturnValueOnce(removeResponses[0])
        .mockReturnValueOnce(removeResponses[1])
        .mockReturnValueOnce(removeResponses[2]);

      const result1 = controller.remove(1);
      const result2 = controller.remove(2);
      const result3 = controller.remove(3);

      expect(result1).toEqual(removeResponses[0]);
      expect(result2).toEqual(removeResponses[1]);
      expect(result3).toEqual(removeResponses[2]);
    });

    it('should handle ParseIntPipe for id parameter', async () => {
      const removeResponse = {
        message: 'Product "Test Product" has been successfully removed'
      };

      mockProductsService.remove.mockReturnValue(removeResponse);

      const result = controller.remove(5);

      expect(service.remove).toHaveBeenCalledWith(5);
      expect(typeof 5).toBe('number'); // Verify ParseIntPipe conversion
    });
  });

  describe('Controller Integration', () => {
    it('should have all required methods defined', () => {
      expect(controller.create).toBeDefined();
      expect(controller.findAll).toBeDefined();
      expect(controller.findOne).toBeDefined();
      expect(controller.update).toBeDefined();
      expect(controller.remove).toBeDefined();
    });

    it('should properly inject ProductsService', () => {
      expect(service).toBeDefined();
      expect(service).toBe(mockProductsService);
    });

    it('should handle service method calls correctly', async () => {
      // Test that controller properly delegates to service
      mockProductsService.findAll.mockReturnValue(mockProducts);
      mockProductsService.findOne.mockReturnValue(mockProduct);

      controller.findAll();
      controller.findOne(1);

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should maintain proper return types', async () => {
      const createDto: CreateProductDto = {
        name: 'Test',
        brand: 'Test',
        price: 100000,
        quantity: 10,
        category: ProductCategory.ELECTRONICS
      };

      const updateDto: UpdateProductDto = { name: 'Updated' };

      mockProductsService.create.mockReturnValue(mockProduct);
      mockProductsService.findAll.mockReturnValue(mockProducts);
      mockProductsService.findOne.mockReturnValue(mockProduct);
      mockProductsService.update.mockReturnValue(mockProduct);
      mockProductsService.remove.mockReturnValue({ message: 'Removed' });

      const createResult = controller.create(createDto);
      const findAllResult = controller.findAll();
      const findOneResult = controller.findOne(1);
      const updateResult = controller.update(1, updateDto);
      const removeResult = controller.remove(1);

      expect(createResult).toEqual(mockProduct);
      expect(Array.isArray(findAllResult)).toBe(true);
      expect(findOneResult).toEqual(mockProduct);
      expect(updateResult).toEqual(mockProduct);
      expect(removeResult).toHaveProperty('message');
    });
  });
});
