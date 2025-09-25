import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CartItems } from "./CartItems";
import { UserAccounts } from "./UserAccounts";

@Index("shopping_carts_pkey", ["cartId"], { unique: true })
@Index("idx_shopping_carts_session_id", ["sessionId"], {})
@Index("idx_shopping_carts_user_id", ["userId"], {})
@Entity("shopping_carts", { schema: "legacy_ecommerce" })
export class ShoppingCarts {
  @Column("uuid", {
    primary: true,
    name: "cart_id",
    default: () => "legacy_ecommerce.uuid_generate_v4()",
  })
  cartId: string;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", {
    name: "session_id",
    nullable: true,
    length: 255,
  })
  sessionId: string | null;

  @Column("character varying", {
    name: "cart_status",
    nullable: true,
    length: 20,
    default: () => "'ACTIVE'",
  })
  cartStatus: string | null;

  @Column("character", {
    name: "currency_code",
    nullable: true,
    length: 3,
    default: () => "'USD'",
  })
  currencyCode: string | null;

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

  @Column("timestamp without time zone", {
    name: "expires_at",
    nullable: true,
    default: () => "(CURRENT_TIMESTAMP + '30 days')",
  })
  expiresAt: Date | null;

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart)
  cartItems: CartItems[];

  @ManyToOne(() => UserAccounts, (userAccounts) => userAccounts.shoppingCarts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserAccounts;
}
