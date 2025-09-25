import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';

@Entity({ schema: 'legacy_ecommerce' })
export class InventoryTransactions {

  [PrimaryKeyProp]?: 'transactionId';

  @PrimaryKey()
  transactionId!: number;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', deleteRule: 'cascade' })
  product!: LegacyEcommerceProducts;

  @Enum({ items: () => InventoryTransactionsTransactionType })
  transactionType!: InventoryTransactionsTransactionType;

  @Property()
  quantityChange!: number;

  @Property()
  remainingQuantity!: number;

  @Property({ length: 50, nullable: true })
  referenceType?: string;

  @Property({ nullable: true })
  referenceId?: number;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'integer', nullable: true })
  createdBy?: number = 1;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}

export enum InventoryTransactionsTransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}
