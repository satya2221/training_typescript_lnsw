import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

// Embedded schema for inventory tracking
@Schema({ _id: false })
export class InventoryInfo {
  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop()
  lowStockThreshold?: number;

  @Prop({ default: 'available' })
  status: 'available' | 'discontinued' | 'out_of_stock';

  @Prop()
  lastRestocked?: Date;
}

const InventorySchema = SchemaFactory.createForClass(InventoryInfo);

// Embedded schema for pricing
@Schema({ _id: false })
export class PriceInfo {
  @Prop({ required: true, type: Number })
  current: number;

  @Prop()
  original?: number;

  @Prop()
  discountPercent?: number;

  @Prop()
  validUntil?: Date;
}

const PriceSchema = SchemaFactory.createForClass(PriceInfo);

@Schema({
  timestamps: true,
  collection: 'products'
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: PriceSchema, required: true })
  pricing: PriceInfo;

  @Prop({ type: InventorySchema, required: true })
  inventory: InventoryInfo;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  // Embedded array of tags for flexible categorization
  @Prop([String])
  tags?: string[];

  // Embedded metadata - showcasing NoSQL flexibility
  @Prop(raw({
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      weight: { type: Number }
    },
    manufacturer: {
      name: { type: String },
      country: { type: String },
      website: { type: String }
    },
    specifications: { type: Map, of: String }
  }))
  metadata?: Record<string, any>;

  // Virtual for category population
  category?: Types.ObjectId;

  // Virtual for order items
  orderItems?: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Virtual populate for category
ProductSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate for order items
ProductSchema.virtual('orderItems', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'productId',
});

// Indexes for efficient queries
ProductSchema.index({ name: 'text', description: 'text' }); // Text search
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ 'inventory.quantity': 1 });
ProductSchema.index({ 'pricing.current': 1 });
ProductSchema.index({ tags: 1 });

// Enable virtual fields in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Pre-save middleware to set low stock status
ProductSchema.pre('save', function(next) {
  if (this.inventory.lowStockThreshold && this.inventory.quantity <= this.inventory.lowStockThreshold) {
    this.inventory.status = this.inventory.quantity === 0 ? 'out_of_stock' : 'available';
  }
  next();
});