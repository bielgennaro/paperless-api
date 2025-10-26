import { sql } from 'drizzle-orm'
import { boolean, index, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { baseColumns } from './base.schema.ts'

export const userRoleEnum = pgEnum('user_role', [
    'ADMIN',
    'USER',
    'MANAGER',
    'GUEST',
])

export const userStatusEnum = pgEnum('user_status', [
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING',
    'BANNED',
])

export const mfaTypeEnum = pgEnum('mfa_type', [
    'SMS',
    'AUTHENTICATOR_APP',
    'EMAIL',
    'WEBAUTH',
    'BACKUP_CODES',
])

export const subscriptionTierEnum = pgEnum('subscription_tier', [
    'FREE',
    'BASIC',
    'PRO',
    'ENTERPRISE',
])

export const users = pgTable('users', {
    ...baseColumns,
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailNormalized: varchar('email_normalized', { length: 255 }).notNull().unique().$defaultFn(() => sql`lower(email)`),
    passwordHash: text('password_hash').notNull(),
    passwordSalt: varchar('password_salt', { length: 32 }).notNull(),
    passwordChangedAt: timestamp('password_changed_at', { mode: 'date' }),
    username: varchar('username', { length: 50 }).notNull().unique(),
    fullName: varchar('full_name', { length: 100 }).notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    role: userRoleEnum('role').notNull().default('USER'),
    status: userStatusEnum('status').notNull().default('PENDING'),
    permissions: jsonb('permissions').notNull().default(sql`'[]'::jsonb`),
    mfaEnabled: boolean('mfa_enabled').notNull().default(false),
    mfaSecret: text('mfa_secret'),
    mfaType: mfaTypeEnum('mfa_type'),
    mfaBackupCodes: jsonb('mfa_backup_codes').notNull().default(sql`'[]'::jsonb`),
    emailVerified: boolean('email_verified').notNull().default(false),
    emailVerifiedAt: timestamp('email_verified_at', { mode: 'date', precision: 6 }),
    phoneNumber: varchar('phone_number', { length: 20 }).unique(),
    phoneVerified: boolean('phone_verified').notNull().default(false),
    phoneVerifiedAt: timestamp('phone_verified_at', { mode: 'date', precision: 6 }),
    lastLoginAt: timestamp('last_login_at', { mode: 'date', precision: 6 }),
    lastLoginIp: varchar('last_login_ip', { length: 45 }),
    lastLoginUserAgent: text('last_login_user_agent'),
    lockedUntil: timestamp('locked_until', { mode: 'date', precision: 6 }),
    customerId: varchar('customer_id', { length: 255 }),
    subscriptionTier: subscriptionTierEnum('subscription_tier').default('FREE'),

}, table => ([
    uniqueIndex('users_email_idx').on(table.emailNormalized).where(sql`${table.deletedAt} IS NULL`),

    uniqueIndex('users_username_idx').on(table.username).where(sql`${table.deletedAt} IS NULL`),

    index('users_status_idx').on(table.status),

    index('users_role_idx').on(table.role),

    index('users_last_login_idx').on(table.lastLoginAt),
]))
