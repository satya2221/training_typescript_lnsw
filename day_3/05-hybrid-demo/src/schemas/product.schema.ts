import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

// Embedded schemas for complex data structures
@Schema({ _id: false })
export class ProductDimensions {
  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;
}

@Schema({ _id: false })
export class ProductPricing {
  @Prop({ required: true })
  basePrice: number;

  @Prop({ required: true })
  currentPrice: number;

  @Prop()
  discountPercentage?: number;

  @Prop()
  discountStartDate?: Date;

  @Prop()
  discountEndDate?: Date;

  @Prop({ default: 'USD' })
  currency: string;
}

@Schema({ _id: false })
export class ProductInventory {
  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ default: 10 })
  lowStockThreshold: number;

  @Prop({ default: true })
  trackQuantity: boolean;

  @Prop({ default: true })
  allowBackorder: boolean;

  @Prop()
  reservedQuantity?: number;
}

@Schema({ _id: false })
export class ProductSEO {
  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop([String])
  keywords?: string[];

  @Prop()
  slug?: string;
}

@Schema({ _id: false })
export class ProductVariant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  priceModifier?: number;

  @Prop()
  sku?: string;
}

// Main Product Schema
@Schema({ 
  timestamps: true,
  collection: 'products'
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  shortDescription?: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, enum: ['active', 'inactive', 'draft', 'archived'], default: 'active' })
  status: string;

  // Category reference (could be MongoDB ObjectId or external reference)
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop()
  categoryName?: string; // Denormalized for performance

  // Brand information
  @Prop()
  brand?: string;

  @Prop()
  manufacturer?: string;

  // Pricing (embedded document)
  @Prop({ type: ProductPricing, required: true })
  pricing: ProductPricing;

  // Inventory (embedded document)
  @Prop({ type: ProductInventory, required: true })
  inventory: ProductInventory;

  // Physical properties
  @Prop({ type: ProductDimensions })
  dimensions?: ProductDimensions;

  // Media
  @Prop([String])
  images?: string[];

  @Prop([String])
  videos?: string[];

  // Flexible attributes for different product types
  @Prop({ type: Map, of: String })
  attributes?: Map<string, any>;

  // Tags and categorization
  @Prop([String])
  tags?: string[];

  @Prop([String])
  collections?: string[];

  // Variants (for products with multiple options)
  @Prop([ProductVariant])
  variants?: ProductVariant[];

  // SEO
  @Prop({ type: ProductSEO })
  seo?: ProductSEO;

  // Analytics and metrics
  @Prop({ default: 0 })
  viewCount?: number;

  @Prop({ default: 0 })
  purchaseCount?: number;

  @Prop({ default: 0 })
  averageRating?: number;

  @Prop({ default: 0 })
  reviewCount?: number;

  // Timestamps (handled by Mongoose)
  createdAt?: Date;
  updatedAt?: Date;

  // Virtual properties
  get isInStock(): boolean {
    return this.inventory.quantity > 0;
  }

  get isLowStock(): boolean {
    return this.inventory.quantity <= this.inventory.lowStockThreshold;
  }

  get displayPrice(): string {
    return `${this.pricing.currency} ${this.pricing.currentPrice.toFixed(2)}`;
  }

  get discountAmount(): number {
    if (this.pricing.discountPercentage) {
      return this.pricing.basePrice * (this.pricing.discountPercentage / 100);
    }
    return 0;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add virtual properties
ProductSchema.virtual('isInStock').get(function() {
  return this.inventory.quantity > 0;
});

ProductSchema.virtual('isLowStock').get(function() {
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

ProductSchema.virtual('displayPrice').get(function() {
  return `${this.pricing.currency} ${this.pricing.currentPrice.toFixed(2)}`;
});

ProductSchema.virtual('discountAmount').get(function() {
  if (this.pricing.discountPercentage) {
    return this.pricing.basePrice * (this.pricing.discountPercentage / 100);
  }
  return 0;
});

// Indexes for performance
ProductSchema.index({ sku: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ 'pricing.currentPrice': 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });