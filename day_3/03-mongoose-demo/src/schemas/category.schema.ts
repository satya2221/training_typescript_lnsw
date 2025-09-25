import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  collection: 'categories'
})
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parentId?: Types.ObjectId;

  // Virtual for products in this category
  products?: Types.ObjectId[];

  // Virtual for child categories
  children?: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Virtual populate for products
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categoryId',
});

// Virtual populate for child categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

// Enable virtual fields in JSON output
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Index for efficient parent-child queries
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ name: 1 });