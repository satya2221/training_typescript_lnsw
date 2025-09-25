import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("product_brands_pkey", ["brandId"], { unique: true })
@Index("product_brands_brand_name_key", ["brandName"], { unique: true })
@Index("product_brands_brand_slug_key", ["brandSlug"], { unique: true })
@Entity("product_brands", { schema: "legacy_ecommerce" })
export class ProductBrands {
  @PrimaryGeneratedColumn({ type: "integer", name: "brand_id" })
  brandId: number;

  @Column("character varying", {
    name: "brand_name",
    unique: true,
    length: 100,
  })
  brandName: string;

  @Column("character varying", {
    name: "brand_slug",
    unique: true,
    length: 100,
  })
  brandSlug: string;

  @Column("text", { name: "brand_description", nullable: true })
  brandDescription: string | null;

  @Column("text", { name: "brand_logo_url", nullable: true })
  brandLogoUrl: string | null;

  @Column("character varying", {
    name: "official_website",
    nullable: true,
    length: 255,
  })
  officialWebsite: string | null;

  @Column("character varying", {
    name: "country_of_origin",
    nullable: true,
    length: 100,
  })
  countryOfOrigin: string | null;

  @Column("boolean", {
    name: "is_featured",
    nullable: true,
    default: () => "false",
  })
  isFeatured: boolean | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

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

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
