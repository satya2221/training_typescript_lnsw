import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductAttributeValues } from "./ProductAttributeValues";

@Index("product_attributes_attribute_code_key", ["attributeCode"], {
  unique: true,
})
@Index("product_attributes_pkey", ["attributeId"], { unique: true })
@Index("product_attributes_attribute_name_key", ["attributeName"], {
  unique: true,
})
@Entity("product_attributes", { schema: "legacy_ecommerce" })
export class ProductAttributes {
  @PrimaryGeneratedColumn({ type: "integer", name: "attribute_id" })
  attributeId: number;

  @Column("character varying", {
    name: "attribute_name",
    unique: true,
    length: 100,
  })
  attributeName: string;

  @Column("character varying", {
    name: "attribute_code",
    unique: true,
    length: 50,
  })
  attributeCode: string;

  @Column("character varying", {
    name: "attribute_type",
    nullable: true,
    length: 20,
    default: () => "'TEXT'",
  })
  attributeType: string | null;

  @Column("boolean", {
    name: "is_required",
    nullable: true,
    default: () => "false",
  })
  isRequired: boolean | null;

  @Column("boolean", {
    name: "is_filterable",
    nullable: true,
    default: () => "false",
  })
  isFilterable: boolean | null;

  @Column("boolean", {
    name: "is_searchable",
    nullable: true,
    default: () => "false",
  })
  isSearchable: boolean | null;

  @Column("integer", {
    name: "display_order",
    nullable: true,
    default: () => "0",
  })
  displayOrder: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(
    () => ProductAttributeValues,
    (productAttributeValues) => productAttributeValues.attribute
  )
  productAttributeValues: ProductAttributeValues[];
}
