import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { PublicUsers } from './PublicUsers';

@Entity({ tableName: 'orders' })
export class PublicOrders {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => PublicUsers, updateRule: 'cascade' })
  user!: PublicUsers;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total!: string;

  @Enum({ items: () => OrdersStatus })
  status: OrdersStatus & Opt = OrdersStatus.PENDING;

  @Property({ type: 'datetime', columnType: 'timestamp(3)', defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ columnType: 'timestamp(3)' })
  updatedAt!: Date;

}

export enum OrdersStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
