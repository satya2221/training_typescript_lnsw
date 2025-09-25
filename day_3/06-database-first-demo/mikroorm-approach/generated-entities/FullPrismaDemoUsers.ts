import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users', schema: 'full_prisma_demo' })
export class FullPrismaDemoUsers {

  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text', unique: 'users_email_key' })
  email!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  phone?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

}
