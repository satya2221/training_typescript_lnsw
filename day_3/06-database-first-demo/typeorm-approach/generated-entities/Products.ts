import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItems } from "./CartItems";
import { InventoryTransactions } from "./InventoryTransactions";
import { OrderItems } from "./OrderItems";
import { ProductAttributeValues } from "./ProductAttributeValues";
import { ProductImages } from "./ProductImages";
import { ProductReviews } from "./ProductReviews";
import { ProductBrands } from "./ProductBrands";
import { ProductCategories } from "./ProductCategories";

@Index("idx_products_price", ["basePrice"], {})
@Index("idx_products_brand_id", ["brandId"], {})
@Index("idx_products_brand_status", ["brandId", "productStatus"], {})
@Index("idx_products_category_id", ["categoryId"], {})
@Index("idx_products_category_status", ["categoryId", "productStatus"], {})
@Index("idx_products_created_at", ["createdAt"], {})
@Index("idx_products_featured", ["isFeatured"], {})
@Index("products_pkey", ["productId"], { unique: true })
@Index("idx_products_slug", ["productSlug"], {})
@Index("products_product_slug_key", ["productSlug"], { unique: true })
@Index("idx_products_status", ["productStatus"], {})
@Index("idx_products_sku", ["sku"], {})
@Index("products_sku_key", ["sku"], { unique: true })
@Entity("products", { schema: "legacy_ecommerce" })
export class Products {
  @PrimaryGeneratedColumn({ type: "integer", name: "product_id" })
  productId: number;

  @Column("character varying", { name: "sku", unique: true, length: 100 })
  sku: string;

  @Column("character varying", { name: "product_name", length: 255 })
  productName: string;

  @Column("character varying", {
    name: "product_slug",
    unique: true,
    length: 255,
  })
  productSlug: string;

  @Column("text", { name: "short_description", nullable: true })
  shortDescription: string | null;

  @Column("text", { name: "detailed_description", nullable: true })
  detailedDescription: string | null;

  @Column("integer", { name: "category_id" })
  categoryId: number;

  @Column("integer", { name: "brand_id", nullable: true })
  brandId: number | null;

  @Column("character varying", {
    name: "product_type",
    nullable: true,
    length: 50,
    default: () => "'SIMPLE'",
  })
  productType: string | null;

  @Column("numeric", { name: "base_price", precision: 12, scale: 2 })
  basePrice: string;

  @Column("numeric", {
    name: "sale_price",
    nullable: true,
    precision: 12,
    scale: 2,
  })
  salePrice: string | null;

  @Column("numeric", {
    name: "cost_price",
    nullable: true,
    precision: 12,
    scale: 2,
  })
  costPrice: string | null;

  @Column("numeric", {
    name: "weight_kg",
    nullable: true,
    precision: 8,
    scale: 3,
  })
  weightKg: string | null;

  @Column("character varying", {
    name: "dimensions_cm",
    nullable: true,
    length: 50,
  })
  dimensionsCm: string | null;

  @Column("character varying", {
    name: "tax_class",
    nullable: true,
    length: 50,
    default: () => "'STANDARD'",
  })
  taxClass: string | null;

  @Column("boolean", {
    name: "is_featured",
    nullable: true,
    default: () => "false",
  })
  isFeatured: boolean | null;

  @Column("boolean", {
    name: "is_digital",
    nullable: true,
    default: () => "false",
  })
  isDigital: boolean | null;

  @Column("boolean", {
    name: "requires_shipping",
    nullable: true,
    default: () => "true",
  })
  requiresShipping: boolean | null;

  @Column("boolean", {
    name: "track_inventory",
    nullable: true,
    default: () => "true",
  })
  trackInventory: boolean | null;

  @Column("boolean", {
    name: "manage_stock",
    nullable: true,
    default: () => "true",
  })
  manageStock: boolean | null;

  @Column("integer", {
    name: "stock_quantity",
    nullable: true,
    default: () => "0",
  })
  stockQuantity: number | null;

  @Column("integer", {
    name: "low_stock_threshold",
    nullable: true,
    default: () => "5",
  })
  lowStockThreshold: number | null;

  @Column("character varying", {
    name: "stock_status",
    nullable: true,
    length: 20,
    default: () => "'IN_STOCK'",
  })
  stockStatus: string | null;

  @Column("character varying", {
    name: "visibility",
    nullable: true,
    length: 20,
    default: () => "'CATALOG'",
  })
  visibility: string | null;

  @Column("character varying", {
    name: "product_status",
    nullable: true,
    length: 20,
    default: () => "'ACTIVE'",
  })
  productStatus: string | null;

  @Column("character varying", {
    name: "seo_meta_title",
    nullable: true,
    length: 160,
  })
  seoMetaTitle: string | null;

  @Column("character varying", {
    name: "seo_meta_description",
    nullable: true,
    length: 320,
  })
  seoMetaDescription: string | null;

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

  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @OneToMany(
    () => InventoryTransactions,
    (inventoryTransactions) => inventoryTransactions.product
  )
  inventoryTransactions: InventoryTransactions[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @OneToMany(
    () => ProductAttributeValues,
    (productAttributeValues) => productAttributeValues.product
  )
  productAttributeValues: ProductAttributeValues[];

  @OneToMany(() => ProductImages, (productImages) => productImages.product)
  productImages: ProductImages[];

  @OneToMany(() => ProductReviews, (productReviews) => productReviews.product)
  productReviews: ProductReviews[];

  @ManyToOne(() => ProductBrands, (productBrands) => productBrands.products)
  @JoinColumn([{ name: "brand_id", referencedColumnName: "brandId" }])
  brand: ProductBrands;

  @ManyToOne(
    () => ProductCategories,
    (productCategories) => productCategories.products
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: ProductCategories;
}
