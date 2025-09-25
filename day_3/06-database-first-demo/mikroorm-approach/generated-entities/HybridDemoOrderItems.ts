import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { HybridDemoOrders } from './HybridDemoOrders';

@Entity({ tableName: 'order_items', schema: 'hybrid_demo' })
export class HybridDemoOrderItems {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => HybridDemoOrders, updateRule: 'cascade', deleteRule: 'cascade' })
  order!: HybridDemoOrders;

  @Property({ type: 'text' })
  productId!: string;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total!: string;

  @Property({ type: 'text' })
  productName!: string;

  @Property({ type: 'text', nullable: true })
  productDescription?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

}
