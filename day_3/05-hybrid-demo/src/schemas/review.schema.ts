import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ _id: false })
export class ReviewMedia {
  @Prop({ required: true, enum: ['image', 'video'] })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  caption?: string;

  @Prop()
  thumbnail?: string;
}

@Schema({ _id: false })
export class ReviewResponse {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  respondedBy: string; // User ID or admin name

  @Prop({ required: true, default: Date.now })
  respondedAt: Date;

  @Prop({ default: false })
  isOfficial: boolean; // From brand/store
}

@Schema({ _id: false })
export class ReviewHelpfulness {
  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ default: 0 })
  notHelpfulCount: number;

  @Prop([String])
  helpfulVoters: string[]; // User IDs who voted helpful

  @Prop([String])
  notHelpfulVoters: string[]; // User IDs who voted not helpful
}

@Schema({ 
  timestamps: true,
  collection: 'reviews'
})
export class Review {
  // Product reference (MongoDB ObjectId as string)
  @Prop({ required: true })
  productId: string;

  // User reference (PostgreSQL User ID)
  @Prop({ required: true })
  userId: number;

  // Order reference for verified purchases (PostgreSQL Order ID)
  @Prop()
  orderId?: number;

  @Prop({ default: false })
  isVerifiedPurchase: boolean;

  // Review content
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Reviewer information (denormalized for performance)
  @Prop({ required: true })
  reviewerName: string;

  @Prop()
  reviewerEmail?: string;

  @Prop({ default: false })
  isAnonymous: boolean;

  // Review status
  @Prop({ required: true, enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'pending' })
  status: string;

  // Media attachments
  @Prop([ReviewMedia])
  media?: ReviewMedia[];

  // Pros and cons
  @Prop([String])
  pros?: string[];

  @Prop([String])
  cons?: string[];

  // Helpfulness tracking
  @Prop({ type: ReviewHelpfulness, default: () => ({}) })
  helpfulness: ReviewHelpfulness;

  // Responses (from brand or other users)
  @Prop([ReviewResponse])
  responses?: ReviewResponse[];

  // Moderation
  @Prop()
  moderatedBy?: string;

  @Prop()
  moderatedAt?: Date;

  @Prop()
  moderationNotes?: string;

  // Flags and reports
  @Prop({ default: 0 })
  flagCount: number;

  @Prop([String])
  flagReasons?: string[];

  // Product snapshot (for historical accuracy)
  @Prop()
  productName?: string;

  @Prop()
  productSku?: string;

  @Prop()
  productVariant?: string;

  // Purchase context
  @Prop()
  purchaseDate?: Date;

  @Prop()
  purchasePrice?: number;

  // Review metadata
  @Prop()
  reviewSource?: string; // 'website', 'mobile_app', 'email_campaign'

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  // Timestamps (handled by Mongoose)
  createdAt?: Date;
  updatedAt?: Date;

  // Virtual properties
  get helpfulnessRatio(): number {
    const total = this.helpfulness.helpfulCount + this.helpfulness.notHelpfulCount;
    return total > 0 ? this.helpfulness.helpfulCount / total : 0;
  }

  get isHelpful(): boolean {
    return this.helpfulnessRatio > 0.6 && this.helpfulness.helpfulCount >= 3;
  }

  get responseCount(): number {
    return this.responses?.length || 0;
  }

  get hasOfficialResponse(): boolean {
    return this.responses?.some(response => response.isOfficial) || false;
  }
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Add virtual properties
ReviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpfulness.helpfulCount + this.helpfulness.notHelpfulCount;
  return total > 0 ? this.helpfulness.helpfulCount / total : 0;
});

ReviewSchema.virtual('isHelpful').get(function() {
  const ratio = this.helpfulnessRatio;
  return ratio > 0.6 && this.helpfulness.helpfulCount >= 3;
});

ReviewSchema.virtual('responseCount').get(function() {
  return this.responses?.length || 0;
});

ReviewSchema.virtual('hasOfficialResponse').get(function() {
  return this.responses?.some(response => response.isOfficial) || false;
});

// Indexes for performance
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ orderId: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ isVerifiedPurchase: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ 'helpfulness.helpfulCount': -1 });

// Compound indexes
ReviewSchema.index({ productId: 1, status: 1, rating: -1 });
ReviewSchema.index({ productId: 1, isVerifiedPurchase: 1, createdAt: -1 });