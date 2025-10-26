import { sql } from 'drizzle-orm'
import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const baseColumns = {
    id: uuid('id').primaryKey().defaultRandom().notNull().$defaultFn(() => sql`gen_random_uuid()`),
    deletedAt: timestamp('deleted_at', { mode: 'date', precision: 6 }),
    createdAt: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
    deletedBy: uuid('deleted_by'),
    version: varchar('version', { length: 10 }),
    correlationId: uuid('correlation_id'),
    causationId: uuid('causation_id'),
}

export const customTypes = {
    metadata: (name: string) => sql`${name} JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(${name}) = 'object')`,
    encrypted: (name: string) => sql`${name} TEXT ENCRYPTED WITH (encryption_type = 'AES256')`,
    ulid: (name: string) => sql`${name} CHAR(26) DEFAULT generate_ulid()`,
}
