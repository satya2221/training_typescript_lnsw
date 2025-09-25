import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users', schema: 'typeorm_demo' })
export class TypeormDemoUsers {

  @PrimaryKey()
  id!: number;

  @Property({ length: -1, unique: 'UQ_97672ac88f789774dd47f7c8be3' })
  email!: string;

  @Property({ length: -1, nullable: true })
  name?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  updatedAt!: Date & Opt;

}
