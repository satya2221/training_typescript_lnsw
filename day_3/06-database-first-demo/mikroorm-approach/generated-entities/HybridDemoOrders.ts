import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { HybridDemoUsers } from './HybridDemoUsers';

@Entity({ tableName: 'orders', schema: 'hybrid_demo' })
export class HybridDemoOrders {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: 'orders_order_number_key' })
  orderNumber!: string;

  @Enum({ items: () => OrdersStatus })
  status: OrdersStatus & Opt = OrdersStatus.PENDING;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: string;

  @Property({ type: 'text' })
  currency: string & Opt = 'USD';

  @ManyToOne({ entity: () => HybridDemoUsers, updateRule: 'cascade' })
  user!: HybridDemoUsers;

  @Property({ type: 'text', nullable: true })
  shippingAddress?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  shippingCost?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

  @Property({ columnType: 'timestamp(3)', nullable: true })
  shippedAt?: Date;

  @Property({ columnType: 'timestamp(3)', nullable: true })
  deliveredAt?: Date;

}

export enum OrdersStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}
