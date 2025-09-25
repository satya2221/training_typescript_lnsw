import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users'
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name?: string;

  // Virtual for orders (populated from Order collection)
  orders?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual populate for orders
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId',
});

// Enable virtual fields in JSON output
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });