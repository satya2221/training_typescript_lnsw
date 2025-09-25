import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { TypeormDemoCategories } from './TypeormDemoCategories';

@Entity({ tableName: 'products', schema: 'typeorm_demo' })
export class TypeormDemoProducts {

  @PrimaryKey()
  id!: number;

  @Property({ length: -1 })
  name!: string;

  @Property({ length: -1, nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: string;

  @Property({ type: 'integer' })
  quantity: number & Opt = 0;

  @ManyToOne({ entity: () => TypeormDemoCategories })
  category!: TypeormDemoCategories;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  updatedAt!: Date & Opt;

}
