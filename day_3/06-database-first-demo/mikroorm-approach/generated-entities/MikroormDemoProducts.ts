import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { MikroormDemoCategories } from './MikroormDemoCategories';

@Entity({ tableName: 'products', schema: 'mikroorm_demo' })
export class MikroormDemoProducts {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  updatedAt!: Date & Opt;

  @Property({ type: 'integer' })
  version: number & Opt = 1;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: string;

  @Property({ type: 'integer' })
  quantity: number & Opt = 0;

  @Property({ nullable: true })
  sku?: string;

  @Property({ type: 'string', length: 50 })
  status: string & Opt = 'active';

  @ManyToOne({ entity: () => MikroormDemoCategories })
  category!: MikroormDemoCategories;

  @Property({ nullable: true })
  tags?: string[];

  @Property({ type: 'json', nullable: true })
  attributes?: any;

}
