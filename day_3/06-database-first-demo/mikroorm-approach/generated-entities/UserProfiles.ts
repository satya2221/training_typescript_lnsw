import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { UserAccounts } from './UserAccounts';

@Entity({ schema: 'legacy_ecommerce' })
export class UserProfiles {

  [PrimaryKeyProp]?: 'profileId';

  @PrimaryKey()
  profileId!: number;

  @ManyToOne({ entity: () => UserAccounts, fieldName: 'user_id', deleteRule: 'cascade', index: 'idx_user_profiles_user_id' })
  user!: UserAccounts;

  @Property({ type: 'text', nullable: true })
  profilePictureUrl?: string;

  @Property({ type: 'text', nullable: true })
  bio?: string;

  @Property({ nullable: true })
  websiteUrl?: string;

  @Property({ type: 'json', nullable: true })
  socialMediaLinks?: any;

  @Property({ type: 'json', nullable: true })
  preferences?: any = '{}';

  @Property({ type: 'integer', nullable: true })
  loyaltyPoints?: number = 0;

  @Property({ length: 20, nullable: true, unique: 'user_profiles_referral_code_key' })
  referralCode?: string;

  @Property({ type: 'string', length: 50, nullable: true })
  timezone?: string = 'UTC';

  @Property({ type: 'string', length: 10, nullable: true })
  languagePreference?: string = 'en';

  @Property({ type: 'boolean', nullable: true })
  marketingConsent?: boolean = false;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}
