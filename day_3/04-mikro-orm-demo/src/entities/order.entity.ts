import { 
  Entity, 
  Property, 
  ManyToOne, 
  OneToMany, 
  Collection, 
  Index, 
  Enum,
  Formula,
  Cascade
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity({ tableName: 'orders' })
@Index({ properties: ['status'] })
@Index({ properties: ['user'] })
@Index({ properties: ['createdAt'] })
export class Order extends BaseEntity {
  @Property({ nullable: true })
  orderNumber?: string;

  @Enum(() => OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Property({ nullable: true })
  shippingAddress?: string;

  @Property({ nullable: true })
  notes?: string;

  // Advanced: JSON field for order metadata
  @Property({ type: 'json', nullable: true })
  metadata?: {
    paymentMethod?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    discountCode?: string;
    discountAmount?: number;
  };

  // Relationships
  @ManyToOne(() => User, { lazy: true })
  user!: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { 
    lazy: true,
    cascade: [Cascade.PERSIST, Cascade.REMOVE]
  })
  items = new Collection<OrderItem>(this);

  // Advanced: Computed total from items
  @Formula('(SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_items WHERE order_id = id)')
  calculatedTotal!: number;

  // Virtual properties
  @Property({ persist: false })
  get displayStatus(): string {
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  }

  @Property({ persist: false })
  get displayTotal(): string {
    return `$${this.totalAmount.toFixed(2)}`;
  }

  @Property({ persist: false })
  get canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
  }

  @Property({ persist: false })
  get isCompleted(): boolean {
    return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(this.status);
  }

  // Business logic methods
  async calculateTotal(): Promise<number> {
    if (!this.items.isInitialized()) {
      await this.items.init();
    }
    
    let total = 0;
    for (const item of this.items) {
      total += item.calculateTotal();
    }
    
    // Apply discount if any
    if (this.metadata?.discountAmount) {
      total -= this.metadata.discountAmount;
    }
    
    return Math.max(0, total);
  }

  async updateTotal(): Promise<void> {
    this.totalAmount = await this.calculateTotal();
  }

  addItem(item: OrderItem): void {
    this.items.add(item);
    item.order = this;
  }

  removeItem(item: OrderItem): void {
    this.items.remove(item);
  }

  updateStatus(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }
    this.status = newStatus;
  }

  cancel(): void {
    if (!this.canBeCancelled) {
      throw new Error('Order cannot be cancelled');
    }
    this.status = OrderStatus.CANCELLED;
  }

  // Advanced: State machine logic
  private canTransitionTo(newStatus: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return transitions[this.status].includes(newStatus);
  }

  // Generate order number
  generateOrderNumber(): void {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }

  validate(): string[] {
    const errors: string[] = [];
    
    if (this.totalAmount < 0) {
      errors.push('Total amount cannot be negative');
    }
    
    if (!this.user) {
      errors.push('Order must have a user');
    }
    
    return errors;
  }
}