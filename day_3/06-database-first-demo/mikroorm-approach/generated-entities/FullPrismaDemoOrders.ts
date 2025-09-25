import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { FullPrismaDemoUsers } from './FullPrismaDemoUsers';

@Entity({ tableName: 'orders', schema: 'full_prisma_demo' })
export class FullPrismaDemoOrders {

  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text', unique: 'orders_order_number_key' })
  orderNumber!: string;

  @Enum({ items: () => OrdersStatus })
  status: OrdersStatus & Opt = OrdersStatus.PENDING;

  @Property({ type: 'decimal', precision: 65, scale: 30 })
  totalAmount!: string;

  @Property({ type: 'text' })
  currency: string & Opt = 'USD';

  @ManyToOne({ entity: () => FullPrismaDemoUsers, updateRule: 'cascade' })
  user!: FullPrismaDemoUsers;

  @Property({ type: 'text' })
  shippingAddress!: string;

  @Property({ type: 'decimal', precision: 65, scale: 30, defaultRaw: `0` })
  shippingCost!: string & Opt;

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
}
