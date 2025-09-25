import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("product_categories_pkey", ["categoryId"], { unique: true })
@Index("idx_product_categories_slug", ["categorySlug"], {})
@Index("product_categories_category_slug_key", ["categorySlug"], {
  unique: true,
})
@Index("idx_product_categories_parent", ["parentCategoryId"], {})
@Entity("product_categories", { schema: "legacy_ecommerce" })
export class ProductCategories {
  @PrimaryGeneratedColumn({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column("character varying", { name: "category_name", length: 100 })
  categoryName: string;

  @Column("character varying", {
    name: "category_slug",
    unique: true,
    length: 100,
  })
  categorySlug: string;

  @Column("integer", { name: "parent_category_id", nullable: true })
  parentCategoryId: number | null;

  @Column("text", { name: "category_description", nullable: true })
  categoryDescription: string | null;

  @Column("text", { name: "category_image_url", nullable: true })
  categoryImageUrl: string | null;

  @Column("integer", {
    name: "display_order",
    nullable: true,
    default: () => "0",
  })
  displayOrder: number | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

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
    () => ProductCategories,
    (productCategories) => productCategories.productCategories
  )
  @JoinColumn([
    { name: "parent_category_id", referencedColumnName: "categoryId" },
  ])
  parentCategory: ProductCategories;

  @OneToMany(
    () => ProductCategories,
    (productCategories) => productCategories.parentCategory
  )
  productCategories: ProductCategories[];

  @OneToMany(() => Products, (products) => products.category)
  products: Products[];
}
