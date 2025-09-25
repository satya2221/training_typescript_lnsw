import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PublicOrders } from './PublicOrders';
import { PublicProducts } from './PublicProducts';

@Entity({ tableName: 'order_items' })
export class PublicOrderItems {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => PublicOrders, updateRule: 'cascade' })
  order!: PublicOrders;

  @ManyToOne({ entity: () => PublicProducts, updateRule: 'cascade' })
  product!: PublicProducts;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

}
