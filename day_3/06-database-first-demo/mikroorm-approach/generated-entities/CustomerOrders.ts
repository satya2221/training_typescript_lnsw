import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { UserAccounts } from './UserAccounts';

@Entity({ schema: 'legacy_ecommerce' })
export class CustomerOrders {

  [PrimaryKeyProp]?: 'orderId';

  @PrimaryKey()
  orderId!: number;

  @Property({ length: 50, index: 'idx_customer_orders_number', unique: 'customer_orders_order_number_key' })
  orderNumber!: string;

  @ManyToOne({ entity: () => UserAccounts, fieldName: 'user_id', nullable: true, index: 'idx_customer_orders_user_id' })
  user?: UserAccounts;

  @Property({ length: 100, nullable: true })
  guestEmail?: string;

  @Enum({ items: () => CustomerOrdersOrderStatus, nullable: true, index: 'idx_customer_orders_status' })
  orderStatus?: CustomerOrdersOrderStatus = CustomerOrdersOrderStatus.PENDING;

  @Enum({ items: () => CustomerOrdersPaymentStatus, nullable: true })
  paymentStatus?: CustomerOrdersPaymentStatus = CustomerOrdersPaymentStatus.PENDING;

  @Property({ type: 'character', length: 3, nullable: true })
  currencyCode?: string = 'USD';

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  subtotalAmount!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true, defaultRaw: `0` })
  taxAmount?: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true, defaultRaw: `0` })
  shippingAmount?: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true, defaultRaw: `0` })
  discountAmount?: string;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount!: string;

  @Property({ length: 50, nullable: true })
  billingFirstName?: string;

  @Property({ length: 50, nullable: true })
  billingLastName?: string;

  @Property({ length: 100, nullable: true })
  billingCompany?: string;

  @Property({ nullable: true })
  billingAddressLine1?: string;

  @Property({ nullable: true })
  billingAddressLine2?: string;

  @Property({ length: 100, nullable: true })
  billingCity?: string;

  @Property({ length: 100, nullable: true })
  billingState?: string;

  @Property({ length: 20, nullable: true })
  billingPostalCode?: string;

  @Property({ type: 'character', length: 2, nullable: true })
  billingCountryCode?: string;

  @Property({ length: 20, nullable: true })
  billingPhone?: string;

  @Property({ length: 50, nullable: true })
  shippingFirstName?: string;

  @Property({ length: 50, nullable: true })
  shippingLastName?: string;

  @Property({ length: 100, nullable: true })
  shippingCompany?: string;

  @Property({ nullable: true })
  shippingAddressLine1?: string;

  @Property({ nullable: true })
  shippingAddressLine2?: string;

  @Property({ length: 100, nullable: true })
  shippingCity?: string;

  @Property({ length: 100, nullable: true })
  shippingState?: string;

  @Property({ length: 20, nullable: true })
  shippingPostalCode?: string;

  @Property({ type: 'character', length: 2, nullable: true })
  shippingCountryCode?: string;

  @Property({ length: 20, nullable: true })
  shippingPhone?: string;

  @Property({ length: 100, nullable: true })
  shippingMethod?: string;

  @Property({ type: 'text', nullable: true })
  orderNotes?: string;

  @Property({ type: 'text', nullable: true })
  internalNotes?: string;

  @Property({ length: 50, nullable: true })
  couponCode?: string;

  @Property({ length: 100, nullable: true })
  referralSource?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property({ columnType: 'inet', nullable: true })
  ipAddress?: unknown;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP`, index: 'idx_customer_orders_placed_at' })
  placedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  confirmedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  shippedAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  deliveredAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}

export enum CustomerOrdersOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum CustomerOrdersPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL_PAID = 'PARTIAL_PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}
