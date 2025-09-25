import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductAttributes } from "./ProductAttributes";
import { Products } from "./Products";

@Index(
  "product_attribute_values_product_id_attribute_id_key",
  ["attributeId", "productId"],
  { unique: true }
)
@Index("product_attribute_values_pkey", ["valueId"], { unique: true })
@Entity("product_attribute_values", { schema: "legacy_ecommerce" })
export class ProductAttributeValues {
  @PrimaryGeneratedColumn({ type: "integer", name: "value_id" })
  valueId: number;

  @Column("integer", { name: "product_id", unique: true })
  productId: number;

  @Column("integer", { name: "attribute_id", unique: true })
  attributeId: number;

  @Column("text", { name: "attribute_value", nullable: true })
  attributeValue: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(
    () => ProductAttributes,
    (productAttributes) => productAttributes.productAttributeValues,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "attribute_id", referencedColumnName: "attributeId" }])
  attribute: ProductAttributes;

  @ManyToOne(() => Products, (products) => products.productAttributeValues, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;
}
