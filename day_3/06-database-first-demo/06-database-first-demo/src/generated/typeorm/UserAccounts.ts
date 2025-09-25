import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerAddresses } from "./CustomerAddresses";
import { CustomerOrders } from "./CustomerOrders";
import { ProductReviews } from "./ProductReviews";
import { ShoppingCarts } from "./ShoppingCarts";
import { UserProfiles } from "./UserProfiles";

@Index("idx_user_accounts_status", ["accountStatus"], {})
@Index("idx_user_accounts_email", ["emailAddress"], {})
@Index("user_accounts_email_address_key", ["emailAddress"], { unique: true })
@Index("user_accounts_pkey", ["userId"], { unique: true })
@Index("user_accounts_username_key", ["username"], { unique: true })
@Index("idx_user_accounts_username", ["username"], {})
@Entity("user_accounts", { schema: "legacy_ecommerce" })
export class UserAccounts {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column("character varying", { name: "username", unique: true, length: 50 })
  username: string;

  @Column("character varying", {
    name: "email_address",
    unique: true,
    length: 100,
  })
  emailAddress: string;

  @Column("character varying", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 50,
  })
  firstName: string | null;

  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 50,
  })
  lastName: string | null;

  @Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 20,
  })
  phoneNumber: string | null;

  @Column("date", { name: "date_of_birth", nullable: true })
  dateOfBirth: string | null;

  @Column("timestamp without time zone", {
    name: "registration_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  registrationDate: Date | null;

  @Column("timestamp without time zone", {
    name: "last_login_time",
    nullable: true,
  })
  lastLoginTime: Date | null;

  @Column("character varying", {
    name: "account_status",
    nullable: true,
    length: 20,
    default: () => "'ACTIVE'",
  })
  accountStatus: string | null;

  @Column("boolean", {
    name: "email_verified",
    nullable: true,
    default: () => "false",
  })
  emailVerified: boolean | null;

  @Column("integer", { name: "created_by", nullable: true, default: () => "1" })
  createdBy: number | null;

  @Column("integer", { name: "updated_by", nullable: true })
  updatedBy: number | null;

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

  @OneToMany(
    () => CustomerAddresses,
    (customerAddresses) => customerAddresses.user
  )
  customerAddresses: CustomerAddresses[];

  @OneToMany(() => CustomerOrders, (customerOrders) => customerOrders.user)
  customerOrders: CustomerOrders[];

  @OneToMany(() => ProductReviews, (productReviews) => productReviews.user)
  productReviews: ProductReviews[];

  @OneToMany(() => ShoppingCarts, (shoppingCarts) => shoppingCarts.user)
  shoppingCarts: ShoppingCarts[];

  @OneToMany(() => UserProfiles, (userProfiles) => userProfiles.user)
  userProfiles: UserProfiles[];
}
