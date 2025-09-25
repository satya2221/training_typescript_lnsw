import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { HybridDemoOrders } from './HybridDemoOrders';

@Entity({ tableName: 'payments', schema: 'hybrid_demo' })
export class HybridDemoPayments {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => HybridDemoOrders, updateRule: 'cascade', deleteRule: 'cascade' })
  order!: HybridDemoOrders;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  amount!: string;

  @Property({ type: 'text' })
  currency: string & Opt = 'USD';

  @Enum({ items: () => PaymentsMethod })
  method!: PaymentsMethod;

  @Enum({ items: () => PaymentsStatus })
  status: PaymentsStatus & Opt = PaymentsStatus.PENDING;

  @Property({ type: 'text', nullable: true })
  transactionId?: string;

  @Property({ type: 'text', nullable: true })
  providerId?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

  @Property({ columnType: 'timestamp(3)', nullable: true })
  paidAt?: Date;

}

export enum PaymentsMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentsStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}
