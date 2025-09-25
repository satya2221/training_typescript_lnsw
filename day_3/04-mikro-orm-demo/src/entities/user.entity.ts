import { Entity, Property, OneToMany, Collection, Index, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'users' })
@Index({ properties: ['email'] })
@Index({ properties: ['createdAt'] })
export class User extends BaseEntity {
  @Property()
  @Unique()
  @Index()
  email!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  address?: string;

  // Advanced: JSON field for flexible user preferences
  @Property({ type: 'json', nullable: true })
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };

  // Advanced: Computed property for full display name
  @Property({ persist: false })
  get displayName(): string {
    return `${this.name} (${this.email})`;
  }

  // One-to-many relationship with lazy loading
  @OneToMany('Order', 'user', { 
    lazy: true,
    orphanRemoval: true 
  })
  orders = new Collection<any>(this);

  // Business logic methods
  hasOrders(): boolean {
    return this.orders.length > 0;
  }

  async getOrderCount(): Promise<number> {
    if (!this.orders.isInitialized()) {
      await this.orders.init();
    }
    return this.orders.length;
  }

  // Advanced: Custom validation
  validate(): string[] {
    const errors: string[] = [];
    
    if (!this.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    if (this.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    return errors;
  }
}