import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ShoppingCarts } from "./ShoppingCarts";
import { Products } from "./Products";

@Index("idx_cart_items_cart_id", ["cartId"], {})
@Index("cart_items_pkey", ["cartItemId"], { unique: true })
@Entity("cart_items", { schema: "legacy_ecommerce" })
export class CartItems {
  @PrimaryGeneratedColumn({ type: "integer", name: "cart_item_id" })
  cartItemId: number;

  @Column("uuid", { name: "cart_id" })
  cartId: string;

  @Column("integer", { name: "quantity", default: () => "1" })
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
    name: "added_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  addedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => ShoppingCarts, (shoppingCarts) => shoppingCarts.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: ShoppingCarts;

  @ManyToOne(() => Products, (products) => products.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;
}
