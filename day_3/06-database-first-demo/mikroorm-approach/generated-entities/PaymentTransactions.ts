import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CustomerOrders } from './CustomerOrders';

@Entity({ schema: 'legacy_ecommerce' })
export class PaymentTransactions {

  [PrimaryKeyProp]?: 'transactionId';

  @PrimaryKey()
  transactionId!: number;

  @ManyToOne({ entity: () => CustomerOrders, fieldName: 'order_id', deleteRule: 'cascade' })
  order!: CustomerOrders;

  @Property({ length: 50 })
  paymentMethod!: string;

  @Property({ length: 50, nullable: true })
  paymentProvider?: string;

  @Property({ nullable: true })
  transactionReference?: string;

  @Enum({ items: () => PaymentTransactionsTransactionType, nullable: true })
  transactionType?: PaymentTransactionsTransactionType;

  @Enum({ items: () => PaymentTransactionsTransactionStatus, nullable: true })
  transactionStatus?: PaymentTransactionsTransactionStatus;

  @Property({ type: 'character', length: 3, nullable: true })
  currencyCode?: string = 'USD';

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string;

  @Property({ type: 'json', nullable: true })
  providerResponse?: any;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  processedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}

export enum PaymentTransactionsTransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
}

export enum PaymentTransactionsTransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
