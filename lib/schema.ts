import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const motorbikes = sqliteTable('motorbikes', {
    id: text('id').primaryKey(), // We'll generate UUIDs or similar
    name: text('name').notNull(),
    price: integer('price').notNull(),
    category: text('category').notNull(),
    year: integer('year').notNull(),
    location: text('location').notNull(),
    isSold: integer('is_sold', { mode: 'boolean' }).notNull().default(false),
    imageUrls: text('image_urls').notNull(), // JSON string of array
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export const categories = sqliteTable('categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
});

export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(), // JSON value or simple string
});
