import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { FullPrismaDemoOrders } from './FullPrismaDemoOrders';

@Entity({ tableName: 'order_items', schema: 'full_prisma_demo' })
export class FullPrismaDemoOrderItems {

  @PrimaryKey({ type: 'text' })
  id!: string;

  @ManyToOne({ entity: () => FullPrismaDemoOrders, updateRule: 'cascade' })
  order!: FullPrismaDemoOrders;

  @Property({ type: 'text' })
  productId!: string;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 65, scale: 30 })
  unitPrice!: string;

  @Property({ type: 'decimal', precision: 65, scale: 30 })
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
