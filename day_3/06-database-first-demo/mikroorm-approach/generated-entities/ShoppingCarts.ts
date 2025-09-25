import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { UserAccounts } from './UserAccounts';

@Entity({ schema: 'legacy_ecommerce' })
export class ShoppingCarts {

  [PrimaryKeyProp]?: 'cartId';

  @PrimaryKey({ type: 'uuid', defaultRaw: `legacy_ecommerce.uuid_generate_v4()` })
  cartId!: string & Opt;

  @ManyToOne({ entity: () => UserAccounts, fieldName: 'user_id', deleteRule: 'cascade', nullable: true, index: 'idx_shopping_carts_user_id' })
  user?: UserAccounts;

  @Property({ nullable: true, index: 'idx_shopping_carts_session_id' })
  sessionId?: string;

  @Enum({ items: () => ShoppingCartsCartStatus, nullable: true })
  cartStatus?: ShoppingCartsCartStatus = ShoppingCartsCartStatus.ACTIVE;

  @Property({ type: 'character', length: 3, nullable: true })
  currencyCode?: string = 'USD';

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `(CURRENT_TIMESTAMP + '30 days'::interval)` })
  expiresAt?: Date;

}

export enum ShoppingCartsCartStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  CONVERTED = 'CONVERTED',
}
