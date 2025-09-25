import { Entity, Enum, Index, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { UserAccounts } from './UserAccounts';

@Entity({ schema: 'legacy_ecommerce' })
export class CustomerAddresses {

  [PrimaryKeyProp]?: 'addressId';

  @PrimaryKey()
  addressId!: number;

  @ManyToOne({ entity: () => UserAccounts, fieldName: 'user_id', deleteRule: 'cascade', index: 'idx_customer_addresses_user_id' })
  user!: UserAccounts;

  @Enum({ items: () => CustomerAddressesAddressType, nullable: true })
  addressType?: CustomerAddressesAddressType = CustomerAddressesAddressType.SHIPPING;

  @Property({ length: 50, nullable: true })
  addressLabel?: string;

  @Property({ length: 100 })
  recipientName!: string;

  @Property()
  streetAddressLine1!: string;

  @Property({ nullable: true })
  streetAddressLine2?: string;

  @Property({ length: 100 })
  city!: string;

  @Property({ length: 100, nullable: true })
  stateProvince?: string;

  @Property({ length: 20 })
  postalCode!: string;

  @Property({ type: 'character', length: 2 })
  countryCode: string & Opt = 'US';

  @Index({ name: 'idx_customer_addresses_default', expression: 'CREATE INDEX idx_customer_addresses_default ON legacy_ecommerce.customer_addresses USING btree (is_default_address) WHERE (is_default_address = true)' })
  @Property({ type: 'boolean', nullable: true })
  isDefaultAddress?: boolean = false;

  @Property({ type: 'text', nullable: true })
  deliveryInstructions?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}

export enum CustomerAddressesAddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
  BOTH = 'BOTH',
}
