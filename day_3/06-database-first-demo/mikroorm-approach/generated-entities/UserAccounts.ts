import { Entity, Enum, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity({ schema: 'legacy_ecommerce' })
export class UserAccounts {

  [PrimaryKeyProp]?: 'userId';

  @PrimaryKey()
  userId!: number;

  @Property({ length: 50, index: 'idx_user_accounts_username', unique: 'user_accounts_username_key' })
  username!: string;

  @Property({ length: 100, index: 'idx_user_accounts_email', unique: 'user_accounts_email_address_key' })
  emailAddress!: string;

  @Property()
  passwordHash!: string;

  @Property({ length: 50, nullable: true })
  firstName?: string;

  @Property({ length: 50, nullable: true })
  lastName?: string;

  @Property({ length: 20, nullable: true })
  phoneNumber?: string;

  @Property({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  registrationDate?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  lastLoginTime?: Date;

  @Enum({ items: () => UserAccountsAccountStatus, nullable: true, index: 'idx_user_accounts_status' })
  accountStatus?: UserAccountsAccountStatus = UserAccountsAccountStatus.ACTIVE;

  @Property({ type: 'boolean', nullable: true })
  emailVerified?: boolean = false;

  @Property({ type: 'integer', nullable: true })
  createdBy?: number = 1;

  @Property({ nullable: true })
  updatedBy?: number;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ columnType: 'timestamp(6)', nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt?: Date;

}

export enum UserAccountsAccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}
