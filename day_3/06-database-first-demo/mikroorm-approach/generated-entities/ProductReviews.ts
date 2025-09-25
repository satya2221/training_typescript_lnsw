import { Entity, Index, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CustomerOrders } from './CustomerOrders';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';
import { UserAccounts } from './UserAccounts';

@Entity({ schema: 'legacy_ecommerce' })
export class ProductReviews {

  [PrimaryKeyProp]?: 'reviewId';

  @PrimaryKey()
  reviewId!: number;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', deleteRule: 'cascade', index: 'idx_product_reviews_product_id' })
  product!: LegacyEcommerceProducts;

  @ManyToOne({ entity: () => UserAccounts, fieldName: 'user_id', deleteRule: 'set null', nullable: true, index: 'idx_product_reviews_user_id' })
  user?: UserAccounts;

  @ManyToOne({ entity: () => CustomerOrders, fieldName: 'order_id', nullable: true })
  order?: CustomerOrders;

  @Property({ length: 100 })
  reviewerName!: string;

  @Property({ length: 100 })
  reviewerEmail!: string;

  @Property()
  rating!: number;

  @Property({ length: 200, nullable: true })
  reviewTitle?: string;

  @Property({ type: 'text', nullable: true })
  reviewContent?: string;

  @Property({ type: 'boolean', nullable: true })
  isVerifiedPurchase?: boolean = false;

  @Index({ name: 'idx_product_reviews_approved', expression: 'CREATE INDEX idx_product_reviews_approved ON legacy_ecommerce.product_reviews USING btree (is_approved) WHERE (is_approved = true)' })
  @Property({ type: 'boolean', nullable: true })
  isApproved?: boolean = false;

  @Property({ type: 'integer', nullable: true })
  helpfulVotes?: number = 0;

  @Property({ type: 'integer', nullable: true })
  totalVotes?: number = 0;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
