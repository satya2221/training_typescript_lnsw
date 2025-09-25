import { Entity, Index, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CustomerOrders } from './CustomerOrders';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';

@Entity({ tableName: 'order_items', schema: 'legacy_ecommerce' })
@Index({ name: 'idx_order_items_product_created', properties: ['product', 'createdAt'] })
export class LegacyEcommerceOrderItems {

  [PrimaryKeyProp]?: 'orderItemId';

  @PrimaryKey()
  orderItemId!: number;

  @ManyToOne({ entity: () => CustomerOrders, fieldName: 'order_id', deleteRule: 'cascade', index: 'idx_order_items_order_id' })
  order!: CustomerOrders;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', index: 'idx_order_items_product_id' })
  product!: LegacyEcommerceProducts;

  @Property({ length: 100 })
  productSku!: string;

  @Property()
  productName!: string;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, generated: '((quantity)::numeric * unit_price) stored', nullable: true })
  totalPrice?: string;

  @Property({ type: 'json', nullable: true })
  productOptions?: any;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}
