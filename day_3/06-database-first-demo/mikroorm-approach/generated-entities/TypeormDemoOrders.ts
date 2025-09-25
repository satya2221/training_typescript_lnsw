import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { TypeormDemoUsers } from './TypeormDemoUsers';

@Entity({ tableName: 'orders', schema: 'typeorm_demo' })
export class TypeormDemoOrders {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => TypeormDemoUsers })
  user!: TypeormDemoUsers;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total!: string;

  @Enum({ items: () => OrdersStatus })
  status: OrdersStatus & Opt = OrdersStatus.PENDING;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'datetime', columnType: 'timestamp(6)', defaultRaw: `now()` })
  updatedAt!: Date & Opt;

}

export enum OrdersStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
