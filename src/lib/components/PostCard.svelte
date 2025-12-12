<script lang="ts">
	import type { Post } from '$lib/server/db/schema';
	import LikeButton from './LikeButton.svelte';

	let {
		post,
		showFullContent = false
	}: {
		post: Post;
		showFullContent?: boolean;
	} = $props();

	// Format date in German
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('de-DE', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}

	// Truncate content for preview
	function getPreview(html: string, maxLength: number = 200): string {
		// Strip HTML tags for preview
		const text = html.replace(/<[^>]*>/g, '');
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<article class="nk-card flex flex-col gap-sm">
	<header class="flex flex-col gap-2xs">
		<h2 class="text-xl font-bold">
			{#if showFullContent}
				{post.title}
			{:else}
				<a href="/lesen/{post.slug}" class="hover:underline">{post.title}</a>
			{/if}
		</h2>
		<div class="flex items-center gap-xs text-sm text-foreground-alt">
			<span>{post.authorName || 'Anonym'}</span>
			<span>•</span>
			<time datetime={post.createdAt.toString()}>{formatDate(post.createdAt)}</time>
		</div>
	</header>

	{#if showFullContent}
		<div class="post-content">
			{@html post.content}
		</div>
	{:else}
		<p class="text-foreground-alt">
			{getPreview(post.content)}
		</p>
	{/if}

	<footer class="flex items-center justify-between pt-xs border-t border-border-card">
		<LikeButton postId={post.id} initialCount={post.likeCount} />

		{#if !showFullContent}
			<a href="/lesen/{post.slug}" class="text-sm text-taxi-blue hover:underline font-medium">
				Weiterlesen →
			</a>
		{/if}
	</footer>
</article>
