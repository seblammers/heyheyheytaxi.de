import { pgTable, uuid, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const postStatusEnum = pgEnum('post_status', ['pending', 'approved', 'rejected']);

export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	slug: text('slug').unique().notNull(),
	title: text('title').notNull(),
	content: text('content').notNull(), // HTML from Edra/Tiptap
	authorName: text('author_name'),
	status: postStatusEnum('status').default('pending').notNull(),
	likeCount: integer('like_count').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	editTokenHash: text('edit_token_hash'),
	updatedAt: timestamp('updated_at')
});

// Type exports for use in components
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
