import { query, form, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { supabase } from '#lib/server/supabase.ts';
import { error, isHttpError } from '@sveltejs/kit';
import type { PublicPost } from '#lib/server/db/schema.ts';
import { generateEditToken, hashToken, verifyToken } from '#lib/server/utils/token.ts';
import { sanitizeStoryHtml, textLength } from '#lib/server/utils/sanitize.ts';
import { checkRateLimit, getClientIP } from '#lib/server/utils/rateLimit.ts';

// Only columns that are safe to expose. Query results are serialized to the
// browser, so author_email and edit_token_hash must never be selected here.
const PUBLIC_COLUMNS =
	'id, slug, title, content, author_name, status, like_count, created_at, updated_at';

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
	updated_at: string | null;
};

// Transform Supabase snake_case to camelCase for frontend
function transformPost(post: SupabasePost): PublicPost {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		// Sanitize on read as well: protects rows stored before sanitizing existed
		// or written directly to the database
		content: sanitizeStoryHtml(post.content),
		authorName: post.author_name || null,
		status: post.status,
		likeCount: post.like_count || 0,
		createdAt: new Date(post.created_at),
		updatedAt: post.updated_at ? new Date(post.updated_at) : null
	};
}

// Sanitize submitted HTML, then validate the visible text length. Done in the
// schema so violations show up as field issues in the form instead of an error page.
const storyContent = z
	.string()
	.transform(sanitizeStoryHtml)
	.refine((html) => textLength(html) >= 50, 'Deine Geschichte muss mindestens 50 Zeichen haben.');

const storyTitle = z
	.string()
	.trim()
	.min(3, 'Dein Titel muss mindestens 3 Zeichen haben.')
	.max(200, 'Dein Titel darf höchstens 200 Zeichen haben');

// Unchecked checkboxes send no value, so SvelteKit requires booleans in form
// schemas to be optional. The refine still makes checking the box mandatory.
// Use default(false), not optional(): zod skips refinements on missing optional
// keys, which would let a crafted request without the field skip consent.
const requiredCheckbox = (message: string) =>
	z
		.boolean()
		.default(false)
		.refine((checked) => checked === true, message);

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
		.select(PUBLIC_COLUMNS)
		.eq('status', 'approved')
		.order('created_at', { ascending: false });

	if (dbError) {
		console.error('[getApprovedPosts] Error:', dbError);
		throw error(500, 'Die Geschichten konnten nicht geladen werden.');
	}

	return (data || []).map(transformPost);
});

// Get a single post by slug
// Content is only returned for approved posts – pending/rejected stories
// must not be readable by anyone who knows or guesses the slug.
export const getPost = query(z.string(), async (slug) => {
	const { data, error: dbError } = await supabase
		.from('posts')
		.select(PUBLIC_COLUMNS)
		.eq('slug', slug)
		.single();

	if (dbError) {
		console.error('[getPost] Error:', dbError);
		if (dbError.code === 'PGRST116') {
			throw error(404, 'Geschichte nicht gefunden');
		}
		throw error(500, 'Die Geschichte konnte nicht geladen werden.');
	}

	if (!data) throw error(404, 'Geschichte nicht gefunden');
	const post = transformPost(data);
	return post.status === 'approved' ? post : { ...post, content: '' };
});

// Get the slug of the story that follows the given one in the overview.
// Mirrors the overview's order (newest first), so "next" means the next older
// approved story. Returns null for the last story.
export const getNextPostSlug = query(z.string(), async (slug) => {
	const { data: current, error: currentError } = await supabase
		.from('posts')
		.select('created_at')
		.eq('slug', slug)
		.single();

	if (currentError || !current) {
		console.error('[getNextPostSlug] Post not found:', currentError);
		return null;
	}

	const { data: next, error: nextError } = await supabase
		.from('posts')
		.select('slug')
		.eq('status', 'approved')
		.lt('created_at', current.created_at)
		.order('created_at', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (nextError) {
		console.error('[getNextPostSlug] Error:', nextError);
		return null;
	}

	return next?.slug ?? null;
});

// Validate edit token for a specific post
// On success, also returns the full post (incl. content of non-approved posts)
// so the author can edit it – getPost withholds that content from everyone else.
export const validateEditToken = query(
	z.object({
		slug: z.string(),
		token: z.string()
	}),
	async ({ slug, token }) => {
		try {
			// Get post to verify token
			const { data: post, error: selectError } = await supabase
				.from('posts')
				.select(`${PUBLIC_COLUMNS}, edit_token_hash`)
				.eq('slug', slug)
				.single();

			if (selectError || !post) {
				console.error('[validateEditToken] Post not found:', selectError);
				return { valid: false, reason: 'Geschichte nicht gefunden' };
			}

			// If post has no token hash, it's an old post that can't be edited
			if (!post.edit_token_hash) {
				return { valid: false, reason: 'Diese Geschichte kann nicht bearbeitet werden' };
			}

			// Verify token
			const isValid = await verifyToken(token, post.edit_token_hash);
			if (!isValid) {
				return { valid: false, reason: 'Dieser Geheimcode passt nicht zu dieser Geschichte' };
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { edit_token_hash, ...publicPost } = post;
			return { valid: true, post: transformPost(publicPost) };
		} catch (err) {
			console.error('[validateEditToken] Error:', err);
			return { valid: false, reason: 'Der Geheimcode konnte nicht geprüft werden' };
		}
	}
);

// Submit a new post (form with validation)
export const submitPost = form(
	z.object({
		title: storyTitle,
		content: storyContent,
		// Required: CC BY-SA demands attribution. Pseudonyms are fine.
		authorName: z
			.string()
			.trim()
			.min(1, 'Bitte gib einen Namen an – ein Pseudonym ist völlig in Ordnung.')
			.max(100, 'Der Name darf höchstens 100 Zeichen haben.'),
		authorEmail: z.union([z.string().length(0), z.email()]).optional(),
		// Checked server-side too, so consent can't be skipped with a crafted request
		licenseAccepted: requiredCheckbox(
			'Bitte bestätige die Lizenz, um deine Geschichte einzureichen.'
		),
		rulesAccepted: requiredCheckbox('Bitte bestätige, dass du die Regeln gelesen hast.'),
		// Honeypot: hidden from humans, bots tend to fill every field
		website: z.string().optional()
	}),
	async ({ title, content, authorName, authorEmail, website }) => {
		// licenseAccepted and rulesAccepted are enforced by the schema; a story can only exist with consent
		if (website) throw error(400, 'Ungültige Anfrage.');

		// Spam protection: IP is only held in memory (see Datenschutz), never stored
		const { request } = getRequestEvent();
		if (!checkRateLimit(`submit:${getClientIP(request)}`).allowed) {
			throw error(
				429,
				'Du hast gerade sehr viele Geschichten eingereicht. Bitte versuche es später noch einmal.'
			);
		}

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
					author_name: authorName,
					author_email: authorEmail || null,
					slug,
					status: 'pending',
					edit_token_hash: editTokenHash
				})
				.select();

			if (dbError) {
				console.error('[submitPost] Database error:', dbError);
				throw error(500, 'Die Geschichte konnte nicht gespeichert werden.');
			}

			return { success: true, slug, editToken };
		} catch (err) {
			// Intentional HTTP errors are passed through to the error page as-is
			if (isHttpError(err)) throw err;
			console.error('[submitPost] Error:', err);
			throw error(500, 'Die Geschichte konnte nicht eingereicht werden.');
		}
	}
);

// Update a post (requires token verification)
export const updatePost = form(
	z.object({
		slug: z.string(),
		token: z.string(),
		title: storyTitle,
		content: storyContent
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
				throw error(404, 'Geschichte nicht gefunden');
			}

			if (!post.edit_token_hash) {
				throw error(
					403,
					'Diese Geschichte kann nicht bearbeitet werden, weil sie keinen Geheimcode hat.'
				);
			}

			// Verify token
			const isValid = await verifyToken(token, post.edit_token_hash);
			if (!isValid) {
				throw error(403, 'Dieser Geheimcode passt nicht zu dieser Geschichte.');
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
				throw error(500, 'Die Änderungen konnten nicht gespeichert werden.');
			}

			if (!updatedPost) {
				console.error('[updatePost] No post returned after update');
				throw error(500, 'Die Änderungen konnten nicht gespeichert werden.');
			}

			return { success: true, slug };
		} catch (err) {
			if (isHttpError(err)) throw err;
			console.error('[updatePost] Error:', err);
			throw error(500, 'Die Änderungen konnten nicht gespeichert werden.');
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
			// Get post to verify token
			const { data: post, error: selectError } = await supabase
				.from('posts')
				.select('edit_token_hash')
				.eq('slug', slug)
				.single();

			if (selectError || !post) {
				console.error('[deletePost] Post not found:', selectError);
				throw error(404, 'Geschichte nicht gefunden');
			}

			if (!post.edit_token_hash) {
				throw error(403, 'Diese Geschichte kann nicht gelöscht werden.');
			}

			// Verify token
			const isValid = await verifyToken(token, post.edit_token_hash);
			if (!isValid) {
				throw error(403, 'Dieser Geheimcode passt nicht zu dieser Geschichte.');
			}

			// Delete post
			const { error: deleteError } = await supabase.from('posts').delete().eq('slug', slug);

			if (deleteError) {
				console.error('[deletePost] Delete error:', deleteError);
				throw error(500, 'Die Geschichte konnte nicht gelöscht werden.');
			}

			return { success: true };
		} catch (err) {
			if (isHttpError(err)) throw err;
			console.error('[deletePost] Error:', err);
			throw error(500, 'Die Geschichte konnte nicht gelöscht werden.');
		}
	}
);
