import { Entity, Property, OneToMany, ManyToOne, Collection, Index } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'categories' })
@Index({ properties: ['name'] })
export class Category extends BaseEntity {
  @Property()
  @Index()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  // Self-referencing relationship for hierarchical categories
  @ManyToOne(() => Category, { nullable: true, lazy: true })
  parent?: Category;

  @OneToMany(() => Category, category => category.parent, { lazy: true })
  children = new Collection<Category>(this);

  // Products in this category
  @OneToMany('Product', 'category', { lazy: true })
  products = new Collection<any>(this);

  // Advanced: Computed property for category path
  @Property({ persist: false })
  get path(): string {
    // This would be computed based on parent hierarchy
    return this.name; // Simplified for now
  }

  // Business logic methods
  isRootCategory(): boolean {
    return !this.parent;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  async getProductCount(): Promise<number> {
    if (!this.products.isInitialized()) {
      await this.products.init();
    }
    return this.products.length;
  }

  // Get all descendant categories (recursive)
  async getAllDescendants(): Promise<Category[]> {
    const descendants: Category[] = [];
    
    if (!this.children.isInitialized()) {
      await this.children.init();
    }
    
    for (const child of this.children) {
      descendants.push(child);
      const childDescendants = await child.getAllDescendants();
      descendants.push(...childDescendants);
    }
    
    return descendants;
  }
}