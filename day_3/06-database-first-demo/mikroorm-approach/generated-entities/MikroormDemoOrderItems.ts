import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { MikroormDemoOrders } from './MikroormDemoOrders';
import { MikroormDemoProducts } from './MikroormDemoProducts';

@Entity({ tableName: 'order_items', schema: 'mikroorm_demo' })
export class MikroormDemoOrderItems {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  updatedAt!: Date & Opt;

  @Property({ type: 'integer' })
  version: number & Opt = 1;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

  @ManyToOne({ entity: () => MikroormDemoOrders })
  order!: MikroormDemoOrders;

  @ManyToOne({ entity: () => MikroormDemoProducts })
  product!: MikroormDemoProducts;

}
