import { Entity, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity({ schema: 'legacy_ecommerce' })
export class ProductBrands {

  [PrimaryKeyProp]?: 'brandId';

  @PrimaryKey()
  brandId!: number;

  @Property({ length: 100, unique: 'product_brands_brand_name_key' })
  brandName!: string;

  @Property({ length: 100, unique: 'product_brands_brand_slug_key' })
  brandSlug!: string;

  @Property({ type: 'text', nullable: true })
  brandDescription?: string;

  @Property({ type: 'text', nullable: true })
  brandLogoUrl?: string;

  @Property({ nullable: true })
  officialWebsite?: string;

  @Property({ length: 100, nullable: true })
  countryOfOrigin?: string;

  @Property({ type: 'boolean', nullable: true })
  isFeatured?: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  isActive?: boolean = true;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
