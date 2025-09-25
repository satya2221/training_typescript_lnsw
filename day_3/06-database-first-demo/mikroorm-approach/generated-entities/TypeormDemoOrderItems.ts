import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { TypeormDemoOrders } from './TypeormDemoOrders';
import { TypeormDemoProducts } from './TypeormDemoProducts';

@Entity({ tableName: 'order_items', schema: 'typeorm_demo' })
export class TypeormDemoOrderItems {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => TypeormDemoOrders })
  order!: TypeormDemoOrders;

  @ManyToOne({ entity: () => TypeormDemoProducts })
  product!: TypeormDemoProducts;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

}
