import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'categories', schema: 'typeorm_demo' })
export class TypeormDemoCategories {

  @PrimaryKey()
  id!: number;

  @Property({ length: -1 })
  name!: string;

  @ManyToOne({ entity: () => TypeormDemoCategories, nullable: true })
  parent?: TypeormDemoCategories;

}
