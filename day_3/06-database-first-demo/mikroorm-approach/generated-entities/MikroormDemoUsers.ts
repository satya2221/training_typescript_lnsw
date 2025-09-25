import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users', schema: 'mikroorm_demo' })
export class MikroormDemoUsers {

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

  @Property({ unique: 'users_email_key' })
  email!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

  @Property({ type: 'json', nullable: true })
  preferences?: any;

}
