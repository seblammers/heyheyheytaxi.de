import { query, form, command } from '$app/server';
import { z } from 'zod';
import { supabase } from '$lib/server/supabase';
import { error } from '@sveltejs/kit';
import type { Post } from '$lib/server/db/schema';
import { generateEditToken, hashToken, verifyToken } from '$lib/server/utils/token';

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
	edit_token_hash: string | null;
	updated_at: string | null;
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
		createdAt: new Date(post.created_at),
		editTokenHash: post.edit_token_hash || null,
		updatedAt: post.updated_at ? new Date(post.updated_at) : null
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

			// Generate edit token and hash it
			const editToken = generateEditToken();
			const editTokenHash = await hashToken(editToken);

			const { error: dbError } = await supabase
				.from('posts')
				.insert({
					title,
					content,
					author_name: authorName || null,
					slug,
					status: 'pending',
					edit_token_hash: editTokenHash
				})
				.select();

			if (dbError) {
				console.error('[submitPost] Database error:', dbError);
				throw error(500, `Failed to create post: ${dbError.message}`);
			}

			return { success: true, slug, editToken };
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

// Update a post (requires token verification)
export const updatePost = form(
	z.object({
		slug: z.string(),
		token: z.string(),
		title: z.string().min(3, 'Titel muss mindestens 3 Zeichen haben').max(200),
		content: z.string().min(10, 'Inhalt muss mindestens 10 Zeichen haben')
	}),
	async ({ slug, token, title, content }) => {
		try {
			// Get post to verify token
			const { data: post, error: selectError } = await supabase
				.from('posts')
				.select('edit_token_hash')
				.eq('slug', slug)
				.single();

			if (selectError || !post) {
				console.error('[updatePost] Post not found:', selectError);
				throw error(404, 'Post nicht gefunden');
			}

			if (!post.edit_token_hash) {
				throw error(403, 'Dieser Post kann nicht bearbeitet werden');
			}

			// Verify token
			const isValid = await verifyToken(token, post.edit_token_hash);
			if (!isValid) {
				throw error(403, 'Ungültiger Bearbeitungstoken');
			}

			// Update post
			const { data: updatedPost, error: updateError } = await supabase
				.from('posts')
				.update({
					title,
					content,
					status: 'pending', // Set back to pending for re-moderation
					updated_at: new Date().toISOString()
				})
				.eq('slug', slug)
				.select()
				.single();

			if (updateError) {
				console.error('[updatePost] Update error:', updateError);
				console.error('[updatePost] Update error details:', JSON.stringify(updateError, null, 2));
				throw error(500, `Failed to update post: ${updateError.message}`);
			}

			if (!updatedPost) {
				console.error('[updatePost] No post returned after update');
				throw error(500, 'Failed to update post: No data returned');
			}

			return { success: true, slug };
		} catch (err) {
			console.error('[updatePost] Error:', err);
			if (err instanceof Error && err.message.includes('Failed to update post')) {
				throw err;
			}
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			throw error(500, 'Failed to update post');
		}
	}
);

// Delete a post (requires token verification)
export const deletePost = form(
	z.object({
		slug: z.string(),
		token: z.string()
	}),
	async ({ slug, token }) => {
		try {
			console.log('[deletePost] Starting deletion:', {
				slug,
				token: token.substring(0, 10) + '...'
			});

			// Get post to verify token
			const { data: post, error: selectError } = await supabase
				.from('posts')
				.select('edit_token_hash')
				.eq('slug', slug)
				.single();

			if (selectError || !post) {
				console.error('[deletePost] Post not found:', selectError);
				throw error(404, 'Post nicht gefunden');
			}

			if (!post.edit_token_hash) {
				console.error('[deletePost] No edit_token_hash found for post');
				throw error(403, 'Dieser Post kann nicht gelöscht werden');
			}

			// Verify token
			const isValid = await verifyToken(token, post.edit_token_hash);
			if (!isValid) {
				console.error('[deletePost] Token verification failed');
				throw error(403, 'Ungültiger Bearbeitungstoken');
			}

			console.log('[deletePost] Token verified, deleting post...');

			// Delete post
			const { error: deleteError } = await supabase.from('posts').delete().eq('slug', slug);

			if (deleteError) {
				console.error('[deletePost] Delete error:', deleteError);
				console.error('[deletePost] Delete error details:', JSON.stringify(deleteError, null, 2));
				throw error(500, `Failed to delete post: ${deleteError.message}`);
			}

			console.log('[deletePost] Post deleted successfully');
			return { success: true };
		} catch (err) {
			console.error('[deletePost] Error:', err);
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			throw error(500, 'Failed to delete post');
		}
	}
);

// In-memory rate limit store (simple approach - for production, use Redis or database)
const statusCheckAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkSimpleRateLimit(identifier: string): { allowed: boolean; remaining: number } {
	const now = Date.now();
	const entry = statusCheckAttempts.get(identifier);

	if (!entry || now > entry.resetAt) {
		statusCheckAttempts.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
		return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR - 1 };
	}

	if (entry.count >= MAX_ATTEMPTS_PER_HOUR) {
		return { allowed: false, remaining: 0 };
	}

	entry.count++;
	statusCheckAttempts.set(identifier, entry);
	return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR - entry.count };
}

// Check story status by token
export const checkStoryStatus = form(
	z.object({
		token: z.string().min(1, 'Token ist erforderlich')
	}),
	async ({ token }) => {
		try {
			// Simple rate limiting: Use token hash as identifier (prevents same token from being checked too often)
			// In production, you'd want IP-based rate limiting via hooks
			const tokenHash = Buffer.from(token).toString('base64').slice(0, 20); // Simple identifier
			const rateLimit = checkSimpleRateLimit(tokenHash);

			if (!rateLimit.allowed) {
				console.warn('[checkStoryStatus] Rate limit exceeded for token');
				throw error(429, 'Zu viele Anfragen. Bitte versuche es in einer Stunde erneut.');
			}

			// Validate token format (40 hex characters)
			if (!/^[a-f0-9]{40}$/i.test(token)) {
				console.warn('[checkStoryStatus] Invalid token format');
				// Still count as an attempt for rate limiting
				return {
					success: false,
					error: 'Ungültiges Token-Format. Bitte überprüfe deinen Token.',
					rateLimitRemaining: rateLimit.remaining
				};
			}

			console.log('[checkStoryStatus] Checking status for token');

			// Get all posts with edit_token_hash (recent posts first, limit to last 1000 for performance)
			const { data: posts, error: selectError } = await supabase
				.from('posts')
				.select('id, slug, title, status, created_at, edit_token_hash')
				.not('edit_token_hash', 'is', null)
				.order('created_at', { ascending: false })
				.limit(1000);

			if (selectError) {
				console.error('[checkStoryStatus] Error fetching posts:', selectError);
				throw error(500, 'Fehler beim Abrufen der Geschichten');
			}

			if (!posts || posts.length === 0) {
				return {
					success: false,
					error: 'Keine Geschichte mit diesem Token gefunden.',
					rateLimitRemaining: rateLimit.remaining
				};
			}

			// Check each post's token hash
			// Add a small delay to slow down brute force attempts
			let checkedCount = 0;
			for (const post of posts) {
				if (!post.edit_token_hash) continue;

				checkedCount++;
				const isValid = await verifyToken(token, post.edit_token_hash);
				if (isValid) {
					// Found matching story
					console.log('[checkStoryStatus] Token verified successfully for post:', post.slug);
					const storyUrl = `/lesen/${post.slug}`;
					return {
						success: true,
						story: {
							slug: post.slug,
							title: post.title,
							status: post.status,
							createdAt: post.created_at,
							url: storyUrl
						},
						rateLimitRemaining: rateLimit.remaining
					};
				}

				// Add small delay after every 10 checks to slow down brute force
				if (checkedCount % 10 === 0) {
					await new Promise((resolve) => setTimeout(resolve, 50));
				}
			}

			// No matching story found
			console.log(
				'[checkStoryStatus] No matching token found after checking',
				checkedCount,
				'posts'
			);
			return {
				success: false,
				error: 'Keine Geschichte mit diesem Token gefunden.',
				rateLimitRemaining: rateLimit.remaining
			};
		} catch (err) {
			console.error('[checkStoryStatus] Error:', err);
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			throw error(500, 'Fehler beim Überprüfen des Status');
		}
	}
);
