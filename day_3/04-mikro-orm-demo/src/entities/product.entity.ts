import { 
  Entity, 
  Property, 
  ManyToOne, 
  OneToMany, 
  Collection, 
  Index, 
  Enum,
  Check,
  Formula
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

@Entity({ tableName: 'products' })
@Index({ properties: ['name'] })
@Index({ properties: ['price'] })
@Index({ properties: ['status'] })
@Index({ properties: ['category', 'status'] })
@Check({ expression: 'price > 0' })
@Check({ expression: 'quantity >= 0' })
export class Product extends BaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ default: 0 })
  quantity!: number;

  @Property({ nullable: true })
  sku?: string;

  @Enum(() => ProductStatus)
  status: ProductStatus = ProductStatus.ACTIVE;

  // Advanced: JSON field for flexible product attributes
  @Property({ type: 'json', nullable: true })
  attributes?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    color?: string;
    material?: string;
    warranty?: string;
    [key: string]: any;
  };

  // Advanced: Array field for tags
  @Property({ type: 'text[]', nullable: true })
  tags?: string[];

  // Relationships
  @ManyToOne(() => Category, { lazy: true })
  category!: Category;

  @OneToMany('OrderItem', 'product', { lazy: true })
  orderItems = new Collection<any>(this);

  // Advanced: Computed/Formula fields (commented out due to complexity)
  // @Formula('price * quantity')
  // totalValue!: number;

  // Virtual properties
  @Property({ persist: false })
  get isInStock(): boolean {
    return this.quantity > 0 && this.status === ProductStatus.ACTIVE;
  }

  @Property({ persist: false })
  get isLowStock(): boolean {
    return this.quantity <= 10 && this.quantity > 0;
  }

  @Property({ persist: false })
  get displayPrice(): string {
    return `$${Number(this.price).toFixed(2)}`;
  }

  // Business logic methods
  canBePurchased(requestedQuantity: number): boolean {
    return this.isInStock && this.quantity >= requestedQuantity;
  }

  reduceStock(quantity: number): void {
    if (!this.canBePurchased(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.quantity -= quantity;
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity += quantity;
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive');
    }
    this.price = newPrice;
  }

  // Advanced: Custom validation
  validate(): string[] {
    const errors: string[] = [];
    
    if (this.price <= 0) {
      errors.push('Price must be positive');
    }
    
    if (this.quantity < 0) {
      errors.push('Quantity cannot be negative');
    }
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    return errors;
  }

  // Advanced: Search functionality
  matchesSearch(query: string): boolean {
    const searchText = query.toLowerCase();
    return (
      this.name.toLowerCase().includes(searchText) ||
      (this.description?.toLowerCase().includes(searchText) ?? false) ||
      (this.sku?.toLowerCase().includes(searchText) ?? false) ||
      (this.tags?.some(tag => tag.toLowerCase().includes(searchText)) ?? false)
    );
  }
}