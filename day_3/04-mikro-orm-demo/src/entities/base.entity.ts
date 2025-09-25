import { PrimaryKey, Property, BaseEntity as MikroBaseEntity } from '@mikro-orm/core';

export abstract class BaseEntity extends MikroBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Version field for optimistic locking
  @Property({ version: true })
  version!: number;

  // Soft delete support
  @Property({ nullable: true })
  deletedAt?: Date;

  // Helper method for soft delete
  softDelete(): void {
    this.deletedAt = new Date();
  }

  // Helper method to check if entity is deleted
  isDeleted(): boolean {
    return this.deletedAt !== undefined;
  }
}