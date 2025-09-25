import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserAccounts } from "./UserAccounts";
import { OrderItems } from "./OrderItems";
import { PaymentTransactions } from "./PaymentTransactions";
import { ProductReviews } from "./ProductReviews";

@Index("customer_orders_pkey", ["orderId"], { unique: true })
@Index("idx_customer_orders_number", ["orderNumber"], {})
@Index("customer_orders_order_number_key", ["orderNumber"], { unique: true })
@Index("idx_customer_orders_status", ["orderStatus"], {})
@Index("idx_customer_orders_placed_at", ["placedAt"], {})
@Index("idx_customer_orders_user_id", ["userId"], {})
@Entity("customer_orders", { schema: "legacy_ecommerce" })
export class CustomerOrders {
  @PrimaryGeneratedColumn({ type: "integer", name: "order_id" })
  orderId: number;

  @Column("character varying", {
    name: "order_number",
    unique: true,
    length: 50,
  })
  orderNumber: string;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", {
    name: "guest_email",
    nullable: true,
    length: 100,
  })
  guestEmail: string | null;

  @Column("character varying", {
    name: "order_status",
    nullable: true,
    length: 30,
    default: () => "'PENDING'",
  })
  orderStatus: string | null;

  @Column("character varying", {
    name: "payment_status",
    nullable: true,
    length: 30,
    default: () => "'PENDING'",
  })
  paymentStatus: string | null;

  @Column("character", {
    name: "currency_code",
    nullable: true,
    length: 3,
    default: () => "'USD'",
  })
  currencyCode: string | null;

  @Column("numeric", { name: "subtotal_amount", precision: 12, scale: 2 })
  subtotalAmount: string;

  @Column("numeric", {
    name: "tax_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  taxAmount: string | null;

  @Column("numeric", {
    name: "shipping_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  shippingAmount: string | null;

  @Column("numeric", {
    name: "discount_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  discountAmount: string | null;

  @Column("numeric", { name: "total_amount", precision: 12, scale: 2 })
  totalAmount: string;

  @Column("character varying", {
    name: "billing_first_name",
    nullable: true,
    length: 50,
  })
  billingFirstName: string | null;

  @Column("character varying", {
    name: "billing_last_name",
    nullable: true,
    length: 50,
  })
  billingLastName: string | null;

  @Column("character varying", {
    name: "billing_company",
    nullable: true,
    length: 100,
  })
  billingCompany: string | null;

  @Column("character varying", {
    name: "billing_address_line1",
    nullable: true,
    length: 255,
  })
  billingAddressLine1: string | null;

  @Column("character varying", {
    name: "billing_address_line2",
    nullable: true,
    length: 255,
  })
  billingAddressLine2: string | null;

  @Column("character varying", {
    name: "billing_city",
    nullable: true,
    length: 100,
  })
  billingCity: string | null;

  @Column("character varying", {
    name: "billing_state",
    nullable: true,
    length: 100,
  })
  billingState: string | null;

  @Column("character varying", {
    name: "billing_postal_code",
    nullable: true,
    length: 20,
  })
  billingPostalCode: string | null;

  @Column("character", {
    name: "billing_country_code",
    nullable: true,
    length: 2,
  })
  billingCountryCode: string | null;

  @Column("character varying", {
    name: "billing_phone",
    nullable: true,
    length: 20,
  })
  billingPhone: string | null;

  @Column("character varying", {
    name: "shipping_first_name",
    nullable: true,
    length: 50,
  })
  shippingFirstName: string | null;

  @Column("character varying", {
    name: "shipping_last_name",
    nullable: true,
    length: 50,
  })
  shippingLastName: string | null;

  @Column("character varying", {
    name: "shipping_company",
    nullable: true,
    length: 100,
  })
  shippingCompany: string | null;

  @Column("character varying", {
    name: "shipping_address_line1",
    nullable: true,
    length: 255,
  })
  shippingAddressLine1: string | null;

  @Column("character varying", {
    name: "shipping_address_line2",
    nullable: true,
    length: 255,
  })
  shippingAddressLine2: string | null;

  @Column("character varying", {
    name: "shipping_city",
    nullable: true,
    length: 100,
  })
  shippingCity: string | null;

  @Column("character varying", {
    name: "shipping_state",
    nullable: true,
    length: 100,
  })
  shippingState: string | null;

  @Column("character varying", {
    name: "shipping_postal_code",
    nullable: true,
    length: 20,
  })
  shippingPostalCode: string | null;

  @Column("character", {
    name: "shipping_country_code",
    nullable: true,
    length: 2,
  })
  shippingCountryCode: string | null;

  @Column("character varying", {
    name: "shipping_phone",
    nullable: true,
    length: 20,
  })
  shippingPhone: string | null;

  @Column("character varying", {
    name: "shipping_method",
    nullable: true,
    length: 100,
  })
  shippingMethod: string | null;

  @Column("text", { name: "order_notes", nullable: true })
  orderNotes: string | null;

  @Column("text", { name: "internal_notes", nullable: true })
  internalNotes: string | null;

  @Column("character varying", {
    name: "coupon_code",
    nullable: true,
    length: 50,
  })
  couponCode: string | null;

  @Column("character varying", {
    name: "referral_source",
    nullable: true,
    length: 100,
  })
  referralSource: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("inet", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column("timestamp without time zone", {
    name: "placed_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  placedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "confirmed_at",
    nullable: true,
  })
  confirmedAt: Date | null;

  @Column("timestamp without time zone", { name: "shipped_at", nullable: true })
  shippedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "delivered_at",
    nullable: true,
  })
  deliveredAt: Date | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => UserAccounts, (userAccounts) => userAccounts.customerOrders)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserAccounts;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @OneToMany(
    () => PaymentTransactions,
    (paymentTransactions) => paymentTransactions.order
  )
  paymentTransactions: PaymentTransactions[];

  @OneToMany(() => ProductReviews, (productReviews) => productReviews.order)
  productReviews: ProductReviews[];
}
