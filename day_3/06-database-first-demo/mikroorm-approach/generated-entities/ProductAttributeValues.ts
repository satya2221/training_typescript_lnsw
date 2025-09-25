import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { LegacyEcommerceProducts } from './LegacyEcommerceProducts';
import { ProductAttributes } from './ProductAttributes';

@Entity({ schema: 'legacy_ecommerce' })
@Unique({ name: 'product_attribute_values_product_id_attribute_id_key', properties: ['product', 'attribute'] })
export class ProductAttributeValues {

  [PrimaryKeyProp]?: 'valueId';

  @PrimaryKey()
  valueId!: number;

  @ManyToOne({ entity: () => LegacyEcommerceProducts, fieldName: 'product_id', deleteRule: 'cascade' })
  product!: LegacyEcommerceProducts;

  @ManyToOne({ entity: () => ProductAttributes, fieldName: 'attribute_id', deleteRule: 'cascade' })
  attribute!: ProductAttributes;

  @Property({ type: 'text', nullable: true })
  attributeValue?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

}
