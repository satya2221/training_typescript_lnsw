import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: '_prisma_migrations' })
export class PrismaMigrations {

  @PrimaryKey({ length: 36 })
  id!: string;

  @Property({ length: 64 })
  checksum!: string;

  @Property({ nullable: true })
  finishedAt?: Date;

  @Property()
  migrationName!: string;

  @Property({ type: 'text', nullable: true })
  logs?: string;

  @Property({ nullable: true })
  rolledBackAt?: Date;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  startedAt!: Date & Opt;

  @Property({ type: 'integer' })
  appliedStepsCount: number & Opt = 0;

}
