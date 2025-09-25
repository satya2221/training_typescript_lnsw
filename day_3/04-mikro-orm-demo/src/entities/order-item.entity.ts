import { Entity, Property, ManyToOne, Index, Check, Formula } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'order_items' })
@Index({ properties: ['order', 'product'] })
@Check({ expression: 'quantity > 0' })
@Check({ expression: 'unit_price > 0' })
export class OrderItem extends BaseEntity {
  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  // Relationships using string references to avoid circular dependencies
  @ManyToOne('Order', { lazy: true })
  order!: any;

  @ManyToOne('Product', { lazy: true })
  product!: any;

  // Advanced: Computed total
  @Formula('quantity * unit_price')
  total!: number;

  // Virtual properties
  @Property({ persist: false })
  get displayTotal(): string {
    return `$${(this.quantity * this.unitPrice).toFixed(2)}`;
  }

  // Business logic
  calculateTotal(): number {
    return this.quantity * this.unitPrice;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity = newQuantity;
  }

  validate(): string[] {
    const errors: string[] = [];
    
    if (this.quantity <= 0) {
      errors.push('Quantity must be positive');
    }
    
    if (this.unitPrice <= 0) {
      errors.push('Unit price must be positive');
    }
    
    return errors;
  }
}