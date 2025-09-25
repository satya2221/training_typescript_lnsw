import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity({ schema: 'legacy_ecommerce' })
export class ProductCategories {

  [PrimaryKeyProp]?: 'categoryId';

  @PrimaryKey()
  categoryId!: number;

  @Property({ length: 100 })
  categoryName!: string;

  @Property({ length: 100, index: 'idx_product_categories_slug', unique: 'product_categories_category_slug_key' })
  categorySlug!: string;

  @ManyToOne({ entity: () => ProductCategories, nullable: true, index: 'idx_product_categories_parent' })
  parent?: ProductCategories;

  @Property({ type: 'text', nullable: true })
  categoryDescription?: string;

  @Property({ type: 'text', nullable: true })
  categoryImageUrl?: string;

  @Property({ type: 'integer', nullable: true })
  displayOrder?: number = 0;

  @Property({ type: 'boolean', nullable: true })
  isActive?: boolean = true;

  @Property({ length: 160, nullable: true })
  seoMetaTitle?: string;

  @Property({ length: 320, nullable: true })
  seoMetaDescription?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
