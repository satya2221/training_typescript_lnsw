import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("inventory_transactions_pkey", ["transactionId"], { unique: true })
@Entity("inventory_transactions", { schema: "legacy_ecommerce" })
export class InventoryTransactions {
  @PrimaryGeneratedColumn({ type: "integer", name: "transaction_id" })
  transactionId: number;

  @Column("character varying", { name: "transaction_type", length: 20 })
  transactionType: string;

  @Column("integer", { name: "quantity_change" })
  quantityChange: number;

  @Column("integer", { name: "remaining_quantity" })
  remainingQuantity: number;

  @Column("character varying", {
    name: "reference_type",
    nullable: true,
    length: 50,
  })
  referenceType: string | null;

  @Column("integer", { name: "reference_id", nullable: true })
  referenceId: number | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("integer", { name: "created_by", nullable: true, default: () => "1" })
  createdBy: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Products, (products) => products.inventoryTransactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;
}
