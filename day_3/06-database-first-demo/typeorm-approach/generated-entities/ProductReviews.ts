import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerOrders } from "./CustomerOrders";
import { Products } from "./Products";
import { UserAccounts } from "./UserAccounts";

@Index("idx_product_reviews_approved", ["isApproved"], {})
@Index("idx_product_reviews_product_id", ["productId"], {})
@Index("product_reviews_pkey", ["reviewId"], { unique: true })
@Index("idx_product_reviews_user_id", ["userId"], {})
@Entity("product_reviews", { schema: "legacy_ecommerce" })
export class ProductReviews {
  @PrimaryGeneratedColumn({ type: "integer", name: "review_id" })
  reviewId: number;

  @Column("integer", { name: "product_id" })
  productId: number;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", { name: "reviewer_name", length: 100 })
  reviewerName: string;

  @Column("character varying", { name: "reviewer_email", length: 100 })
  reviewerEmail: string;

  @Column("integer", { name: "rating" })
  rating: number;

  @Column("character varying", {
    name: "review_title",
    nullable: true,
    length: 200,
  })
  reviewTitle: string | null;

  @Column("text", { name: "review_content", nullable: true })
  reviewContent: string | null;

  @Column("boolean", {
    name: "is_verified_purchase",
    nullable: true,
    default: () => "false",
  })
  isVerifiedPurchase: boolean | null;

  @Column("boolean", {
    name: "is_approved",
    nullable: true,
    default: () => "false",
  })
  isApproved: boolean | null;

  @Column("integer", {
    name: "helpful_votes",
    nullable: true,
    default: () => "0",
  })
  helpfulVotes: number | null;

  @Column("integer", {
    name: "total_votes",
    nullable: true,
    default: () => "0",
  })
  totalVotes: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => CustomerOrders,
    (customerOrders) => customerOrders.productReviews
  )
  @JoinColumn([{ name: "order_id", referencedColumnName: "orderId" }])
  order: CustomerOrders;

  @ManyToOne(() => Products, (products) => products.productReviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Products;

  @ManyToOne(
    () => UserAccounts,
    (userAccounts) => userAccounts.productReviews,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserAccounts;
}
