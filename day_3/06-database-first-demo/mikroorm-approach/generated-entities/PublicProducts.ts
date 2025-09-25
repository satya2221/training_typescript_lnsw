import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { PublicCategories } from './PublicCategories';

@Entity({ tableName: 'products' })
export class PublicProducts {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: string;

  @Property({ type: 'integer' })
  quantity: number & Opt = 0;

  @ManyToOne({ entity: () => PublicCategories, updateRule: 'cascade' })
  category!: PublicCategories;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

}
