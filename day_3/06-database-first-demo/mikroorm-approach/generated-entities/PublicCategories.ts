import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'categories' })
export class PublicCategories {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  name!: string;

  @ManyToOne({ entity: () => PublicCategories, updateRule: 'cascade', deleteRule: 'set null', nullable: true })
  parent?: PublicCategories;

}
