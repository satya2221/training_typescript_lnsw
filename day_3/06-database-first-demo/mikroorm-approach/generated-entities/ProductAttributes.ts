import { Entity, Enum, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity({ schema: 'legacy_ecommerce' })
export class ProductAttributes {

  [PrimaryKeyProp]?: 'attributeId';

  @PrimaryKey()
  attributeId!: number;

  @Property({ length: 100, unique: 'product_attributes_attribute_name_key' })
  attributeName!: string;

  @Property({ length: 50, unique: 'product_attributes_attribute_code_key' })
  attributeCode!: string;

  @Enum({ items: () => ProductAttributesAttributeType, nullable: true })
  attributeType?: ProductAttributesAttributeType = ProductAttributesAttributeType.TEXT;

  @Property({ type: 'boolean', nullable: true })
  isRequired?: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  isFilterable?: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  isSearchable?: boolean = false;

  @Property({ type: 'integer', nullable: true })
  displayOrder?: number = 0;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}

export enum ProductAttributesAttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}
