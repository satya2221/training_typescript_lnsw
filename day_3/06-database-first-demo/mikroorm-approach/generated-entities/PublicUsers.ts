import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class PublicUsers {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: 'users_email_key' })
  email!: string;

  @Property({ type: 'text', nullable: true })
  name?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

}
