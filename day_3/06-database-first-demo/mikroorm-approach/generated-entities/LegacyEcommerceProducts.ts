import { Entity, Enum, Index, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { ProductBrands } from './ProductBrands';
import { ProductCategories } from './ProductCategories';

@Entity({ tableName: 'products', schema: 'legacy_ecommerce' })
@Index({ name: 'idx_products_brand_status', properties: ['brand', 'productStatus'] })
@Index({ name: 'idx_products_category_status', properties: ['category', 'productStatus'] })
@Index({ name: 'idx_products_description_gin', expression: 'CREATE INDEX idx_products_description_gin ON legacy_ecommerce.products USING gin (to_tsvector(\'english\'::regconfig, detailed_description))' })
@Index({ name: 'idx_products_name_gin', expression: 'CREATE INDEX idx_products_name_gin ON legacy_ecommerce.products USING gin (to_tsvector(\'english\'::regconfig, (product_name)::text))' })
export class LegacyEcommerceProducts {

  [PrimaryKeyProp]?: 'productId';

  @PrimaryKey()
  productId!: number;

  @Property({ length: 100, index: 'idx_products_sku', unique: 'products_sku_key' })
  sku!: string;

  @Property()
  productName!: string;

  @Property({ index: 'idx_products_slug', unique: 'products_product_slug_key' })
  productSlug!: string;

  @Property({ type: 'text', nullable: true })
  shortDescription?: string;

  @Property({ type: 'text', nullable: true })
  detailedDescription?: string;

  @ManyToOne({ entity: () => ProductCategories, fieldName: 'category_id', index: 'idx_products_category_id' })
  category!: ProductCategories;

  @ManyToOne({ entity: () => ProductBrands, fieldName: 'brand_id', nullable: true, index: 'idx_products_brand_id' })
  brand?: ProductBrands;

  @Enum({ items: () => ProductsProductType, nullable: true })
  productType?: ProductsProductType = ProductsProductType.SIMPLE;

  @Property({ type: 'decimal', precision: 12, scale: 2, index: 'idx_products_price' })
  basePrice!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salePrice?: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costPrice?: string;

  @Property({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weightKg?: string;

  @Property({ length: 50, nullable: true })
  dimensionsCm?: string;

  @Property({ type: 'string', length: 50, nullable: true })
  taxClass?: string = 'STANDARD';

  @Index({ name: 'idx_products_featured', expression: 'CREATE INDEX idx_products_featured ON legacy_ecommerce.products USING btree (is_featured) WHERE (is_featured = true)' })
  @Property({ type: 'boolean', nullable: true })
  isFeatured?: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  isDigital?: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  requiresShipping?: boolean = true;

  @Property({ type: 'boolean', nullable: true })
  trackInventory?: boolean = true;

  @Property({ type: 'boolean', nullable: true })
  manageStock?: boolean = true;

  @Property({ type: 'integer', nullable: true })
  stockQuantity?: number = 0;

  @Property({ type: 'integer', nullable: true })
  lowStockThreshold?: number = 5;

  @Enum({ items: () => ProductsStockStatus, nullable: true })
  stockStatus?: ProductsStockStatus = ProductsStockStatus.IN_STOCK;

  @Enum({ items: () => ProductsVisibility, nullable: true })
  visibility?: ProductsVisibility = ProductsVisibility.CATALOG;

  @Enum({ items: () => ProductsProductStatus, nullable: true, index: 'idx_products_status' })
  productStatus?: ProductsProductStatus = ProductsProductStatus.ACTIVE;

  @Property({ length: 160, nullable: true })
  seoMetaTitle?: string;

  @Property({ length: 320, nullable: true })
  seoMetaDescription?: string;

  @Property({ type: 'integer', nullable: true })
  createdBy?: number = 1;

  @Property({ nullable: true })
  updatedBy?: number;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP`, index: 'idx_products_created_at' })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}

export enum ProductsProductType {
  SIMPLE = 'SIMPLE',
  CONFIGURABLE = 'CONFIGURABLE',
  BUNDLE = 'BUNDLE',
  DIGITAL = 'DIGITAL',
}

export enum ProductsStockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  BACKORDER = 'BACKORDER',
}

export enum ProductsVisibility {
  CATALOG = 'CATALOG',
  SEARCH = 'SEARCH',
  HIDDEN = 'HIDDEN',
}

export enum ProductsProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}
