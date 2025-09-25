import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerOrders } from "./CustomerOrders";

@Index("payment_transactions_pkey", ["transactionId"], { unique: true })
@Entity("payment_transactions", { schema: "legacy_ecommerce" })
export class PaymentTransactions {
  @PrimaryGeneratedColumn({ type: "integer", name: "transaction_id" })
  transactionId: number;

  @Column("character varying", { name: "payment_method", length: 50 })
  paymentMethod: string;

  @Column("character varying", {
    name: "payment_provider",
    nullable: true,
    length: 50,
  })
  paymentProvider: string | null;

  @Column("character varying", {
    name: "transaction_reference",
    nullable: true,
    length: 255,
  })
  transactionReference: string | null;

  @Column("character varying", {
    name: "transaction_type",
    nullable: true,
    length: 20,
  })
  transactionType: string | null;

  @Column("character varying", {
    name: "transaction_status",
    nullable: true,
    length: 20,
  })
  transactionStatus: string | null;

  @Column("character", {
    name: "currency_code",
    nullable: true,
    length: 3,
    default: () => "'USD'",
  })
  currencyCode: string | null;

  @Column("numeric", { name: "amount", precision: 12, scale: 2 })
  amount: string;

  @Column("jsonb", { name: "provider_response", nullable: true })
  providerResponse: object | null;

  @Column("timestamp without time zone", {
    name: "processed_at",
    nullable: true,
  })
  processedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(
    () => CustomerOrders,
    (customerOrders) => customerOrders.paymentTransactions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "order_id", referencedColumnName: "orderId" }])
  order: CustomerOrders;
}
