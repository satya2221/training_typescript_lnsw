import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

// Embedded schema for order items - denormalized approach typical in NoSQL
@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  // Denormalized product info to avoid joins
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, type: Number })
  unitPrice: number;

  @Prop({ required: true, type: Number })
  totalPrice: number;

  // Product snapshot at time of order - NoSQL advantage
  @Prop({ type: Object })
  productSnapshot?: {
    description?: string;
    categoryName?: string;
    tags?: string[];
  };
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Embedded schema for shipping address
@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  country: string;
}

const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({
  timestamps: true,
  collection: 'orders'
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Embedded order items array - typical NoSQL pattern
  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, type: Number })
  total: number;

  @Prop({
    required: true,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  })
  status: string;

  // Embedded shipping address
  @Prop({ type: ShippingAddressSchema })
  shippingAddress?: ShippingAddress;

  // Order metadata with flexible schema
  @Prop({ type: Object })
  metadata?: {
    payment?: {
      method: string;
      transactionId: string;
      paidAt: Date;
    };
    shipping?: {
      method: string;
      trackingNumber: string;
      estimatedDelivery: Date;
      actualDelivery: Date;
    };
    notes?: string;
  };

  // Virtual for user population
  user?: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Virtual populate for user
OrderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for efficient queries
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'items.productId': 1 });

// Enable virtual fields in JSON output
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// Pre-save middleware to calculate total
OrderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
  next();
});