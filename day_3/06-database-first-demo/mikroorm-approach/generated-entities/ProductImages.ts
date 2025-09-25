import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';

@Entity({ schema: 'legacy_ecommerce' })
export class ProductImages {

  [PrimaryKeyProp]?: 'imageId';

  @PrimaryKey()
  imageId!: number;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', deleteRule: 'cascade' })
  product!: LegacyEcommerceProducts;

  @Property({ type: 'text' })
  imageUrl!: string;

  @Property({ nullable: true })
  imageAltText?: string;

  @Enum({ items: () => ProductImagesImageType, nullable: true })
  imageType?: ProductImagesImageType = ProductImagesImageType.GALLERY;

  @Property({ type: 'integer', nullable: true })
  displayOrder?: number = 0;

  @Property({ type: 'boolean', nullable: true })
  isActive?: boolean = true;

  @Property({ nullable: true })
  fileSizeBytes?: number;

  @Property({ length: 20, nullable: true })
  imageDimensions?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}

export enum ProductImagesImageType {
  MAIN = 'MAIN',
  GALLERY = 'GALLERY',
  THUMBNAIL = 'THUMBNAIL',
}
