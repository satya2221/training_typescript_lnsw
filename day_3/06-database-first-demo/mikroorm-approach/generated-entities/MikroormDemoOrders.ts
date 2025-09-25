import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { MikroormDemoUsers } from './MikroormDemoUsers';

@Entity({ tableName: 'orders', schema: 'mikroorm_demo' })
export class MikroormDemoOrders {

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

  @Property({ nullable: true })
  orderNumber?: string;

  @Property({ type: 'string', length: 50 })
  status: string & Opt = 'pending';

  @Property({ type: 'decimal', precision: 10, scale: 2, defaultRaw: `0` })
  totalAmount!: string & Opt;

  @Property({ type: 'text', nullable: true })
  shippingAddress?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: any;

  @ManyToOne({ entity: () => MikroormDemoUsers })
  user!: MikroormDemoUsers;

}
