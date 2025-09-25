import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';
import { ShoppingCarts } from './ShoppingCarts';

@Entity({ schema: 'legacy_ecommerce' })
export class CartItems {

  [PrimaryKeyProp]?: 'cartItemId';

  @PrimaryKey()
  cartItemId!: number;

  @ManyToOne({ entity: () => ShoppingCarts, fieldName: 'cart_id', deleteRule: 'cascade', index: 'idx_cart_items_cart_id' })
  cart!: ShoppingCarts;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', deleteRule: 'cascade' })
  product!: LegacyEcommerceProducts;

  @Property({ type: 'integer' })
  quantity: number & Opt = 1;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, generated: '((quantity)::numeric * unit_price) stored', nullable: true })
  totalPrice?: string;

  @Property({ type: 'json', nullable: true })
  productOptions?: any;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  addedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
