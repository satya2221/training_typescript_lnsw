import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerOrders } from "./CustomerOrders";
import { Products } from "./Products";

@Index("idx_order_items_product_created", ["createdAt", "productId"], {})
@Index("idx_order_items_order_id", ["orderId"], {})
@Index("order_items_pkey", ["orderItemId"], { unique: true })
@Index("idx_order_items_product_id", ["productId"], {})
@Entity("order_items", { schema: "legacy_ecommerce" })
export class OrderItems {
  @PrimaryGeneratedColumn({ type: "integer", name: "order_item_id" })
  orderItemId: number;

  @Column("integer", { name: "order_id" })
  orderId: number;

  @Column("integer", { name: "product_id" })
  productId: number;

  @Column("character varying", { name: "product_sku", length: 100 })
  productSku: string;

  @Column("character varying", { name: "product_name", length: 255 })
  productName: string;

  @Column("integer", { name: "quantity" })
  quantity: number;

  @Column("numeric", { name: "unit_price", precision: 12, scale: 2 })
  unitPrice: string;

  @Column("numeric", {
    name: "total_price",
    nullable: true,
    precision: 12,
    scale: 2,
  })
  totalPrice: string | null;

  @Column("jsonb", { name: "product_options", nullable: true })
  productOptions: object | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(
    () => CustomerOrders,
    (customerOrders) => customerOrders.orderItems,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "order_id", referencedColumnName: "orderId" }])
  order: CustomerOrders;

  @ManyToOne(() => Products, (products) => products.orderItems)
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;
}
