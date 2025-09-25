import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserAccounts } from "./UserAccounts";

@Index("customer_addresses_pkey", ["addressId"], { unique: true })
@Index("idx_customer_addresses_default", ["isDefaultAddress"], {})
@Index("idx_customer_addresses_user_id", ["userId"], {})
@Entity("customer_addresses", { schema: "legacy_ecommerce" })
export class CustomerAddresses {
  @PrimaryGeneratedColumn({ type: "integer", name: "address_id" })
  addressId: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("character varying", {
    name: "address_type",
    nullable: true,
    length: 20,
    default: () => "'SHIPPING'",
  })
  addressType: string | null;

  @Column("character varying", {
    name: "address_label",
    nullable: true,
    length: 50,
  })
  addressLabel: string | null;

  @Column("character varying", { name: "recipient_name", length: 100 })
  recipientName: string;

  @Column("character varying", { name: "street_address_line1", length: 255 })
  streetAddressLine1: string;

  @Column("character varying", {
    name: "street_address_line2",
    nullable: true,
    length: 255,
  })
  streetAddressLine2: string | null;

  @Column("character varying", { name: "city", length: 100 })
  city: string;

  @Column("character varying", {
    name: "state_province",
    nullable: true,
    length: 100,
  })
  stateProvince: string | null;

  @Column("character varying", { name: "postal_code", length: 20 })
  postalCode: string;

  @Column("character", {
    name: "country_code",
    length: 2,
    default: () => "'US'",
  })
  countryCode: string;

  @Column("boolean", {
    name: "is_default_address",
    nullable: true,
    default: () => "false",
  })
  isDefaultAddress: boolean | null;

  @Column("text", { name: "delivery_instructions", nullable: true })
  deliveryInstructions: string | null;

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

  @ManyToOne(
    () => UserAccounts,
    (userAccounts) => userAccounts.customerAddresses,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserAccounts;
}
