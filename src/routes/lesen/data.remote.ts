import { query, form, command } from '$app/server';
import { z } from 'zod';
import { supabase } from '$lib/server/supabase';
import { error } from '@sveltejs/kit';
import type { Post } from '$lib/server/db/schema';

// Supabase returns snake_case, we need to transform to camelCase
type SupabasePost = {
	id: string;
	slug: string;
	title: string;
	content: string;
	author_name: string | null;
	status: 'pending' | 'approved' | 'rejected';
	like_count: number;
	created_at: string;
};

// Transform Supabase snake_case to camelCase for frontend
function transformPost(post: SupabasePost): Post {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		content: post.content,
		authorName: post.author_name || null,
		status: post.status,
		likeCount: post.like_count || 0,
		createdAt: new Date(post.created_at)
	};
}

// Generate slug from title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[äöüß]/g, (char) => {
			const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
			return map[char] || char;
		})
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.slice(0, 100);
}

// List all approved posts
export const getApprovedPosts = query(async () => {
	const { data, error: dbError } = await supabase
		.from('posts')
		.select('*')
		.eq('status', 'approved')
		.order('created_at', { ascending: false });

	if (dbError) {
		console.error('[getApprovedPosts] Error:', dbError);
		throw error(500, 'Failed to fetch posts');
	}

	return (data || []).map(transformPost);
});

// Get a single post by slug
export const getPost = query(z.string(), async (slug) => {
	const { data, error: dbError } = await supabase
		.from('posts')
		.select('*')
		.eq('slug', slug)
		.single();

	if (dbError) {
		console.error('[getPost] Error:', dbError);
		if (dbError.code === 'PGRST116') {
			throw error(404, 'Post nicht gefunden');
		}
		throw error(500, 'Failed to fetch post');
	}

	if (!data) throw error(404, 'Post nicht gefunden');
	return transformPost(data);
});

// Submit a new post (form with validation)
export const submitPost = form(
	z.object({
		title: z.string().min(3, 'Titel muss mindestens 3 Zeichen haben').max(200),
		content: z.string().min(10, 'Inhalt muss mindestens 10 Zeichen haben'),
		authorName: z.string().max(100).optional()
	}),
	async ({ title, content, authorName }) => {
		try {
			const baseSlug = generateSlug(title);

			// Ensure unique slug by appending timestamp if needed
			const timestamp = Date.now().toString(36);
			const slug = `${baseSlug}-${timestamp}`;

			const { error: dbError } = await supabase
				.from('posts')
				.insert({
					title,
					content,
					author_name: authorName || null,
					slug,
					status: 'pending'
				})
				.select();

			if (dbError) {
				console.error('[submitPost] Database error:', dbError);
				throw error(500, `Failed to create post: ${dbError.message}`);
			}

			return { success: true, slug };
		} catch (err) {
			console.error('[submitPost] Error:', err);
			if (err instanceof Error && err.message.includes('Failed to create post')) {
				throw err;
			}
			throw error(500, 'Failed to submit post');
		}
	}
);

// Like a post
export const likePost = command(z.string().uuid(), async (id) => {
	// Get current like count
	const { data: post, error: selectError } = await supabase
		.from('posts')
		.select('like_count')
		.eq('id', id)
		.single();

	if (selectError) {
		console.error('[likePost] Select error:', selectError);
		throw error(500, 'Failed to fetch post');
	}

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Increment like count
	const { error: updateError } = await supabase
		.from('posts')
		.update({ like_count: (post.like_count || 0) + 1 })
		.eq('id', id);

	if (updateError) {
		console.error('[likePost] Update error:', updateError);
		throw error(500, 'Failed to like post');
	}
});
