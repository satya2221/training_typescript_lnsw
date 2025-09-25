import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserAccounts } from "./UserAccounts";

@Index("user_profiles_pkey", ["profileId"], { unique: true })
@Index("user_profiles_referral_code_key", ["referralCode"], { unique: true })
@Index("idx_user_profiles_user_id", ["userId"], {})
@Entity("user_profiles", { schema: "legacy_ecommerce" })
export class UserProfiles {
  @PrimaryGeneratedColumn({ type: "integer", name: "profile_id" })
  profileId: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("text", { name: "profile_picture_url", nullable: true })
  profilePictureUrl: string | null;

  @Column("text", { name: "bio", nullable: true })
  bio: string | null;

  @Column("character varying", {
    name: "website_url",
    nullable: true,
    length: 255,
  })
  websiteUrl: string | null;

  @Column("jsonb", { name: "social_media_links", nullable: true })
  socialMediaLinks: object | null;

  @Column("jsonb", { name: "preferences", nullable: true, default: {} })
  preferences: object | null;

  @Column("integer", {
    name: "loyalty_points",
    nullable: true,
    default: () => "0",
  })
  loyaltyPoints: number | null;

  @Column("character varying", {
    name: "referral_code",
    nullable: true,
    unique: true,
    length: 20,
  })
  referralCode: string | null;

  @Column("character varying", {
    name: "timezone",
    nullable: true,
    length: 50,
    default: () => "'UTC'",
  })
  timezone: string | null;

  @Column("character varying", {
    name: "language_preference",
    nullable: true,
    length: 10,
    default: () => "'en'",
  })
  languagePreference: string | null;

  @Column("boolean", {
    name: "marketing_consent",
    nullable: true,
    default: () => "false",
  })
  marketingConsent: boolean | null;

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

  @ManyToOne(() => UserAccounts, (userAccounts) => userAccounts.userProfiles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserAccounts;
}
