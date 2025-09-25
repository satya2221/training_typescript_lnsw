import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("product_images_pkey", ["imageId"], { unique: true })
@Entity("product_images", { schema: "legacy_ecommerce" })
export class ProductImages {
  @PrimaryGeneratedColumn({ type: "integer", name: "image_id" })
  imageId: number;

  @Column("text", { name: "image_url" })
  imageUrl: string;

  @Column("character varying", {
    name: "image_alt_text",
    nullable: true,
    length: 255,
  })
  imageAltText: string | null;

  @Column("character varying", {
    name: "image_type",
    nullable: true,
    length: 20,
    default: () => "'GALLERY'",
  })
  imageType: string | null;

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

  @Column("integer", { name: "file_size_bytes", nullable: true })
  fileSizeBytes: number | null;

  @Column("character varying", {
    name: "image_dimensions",
    nullable: true,
    length: 20,
  })
  imageDimensions: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Products, (products) => products.productImages, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;
}
