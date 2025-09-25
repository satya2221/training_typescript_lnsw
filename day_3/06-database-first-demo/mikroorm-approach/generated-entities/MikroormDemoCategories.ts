import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'categories', schema: 'mikroorm_demo' })
export class MikroormDemoCategories {

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

  @ManyToOne({ entity: () => MikroormDemoCategories, nullable: true })
  parent?: MikroormDemoCategories;

}
