<script lang="ts">
	import type { PublicPost } from '#lib/server/db/schema.ts';

	let {
		post,
		showFullContent = false
	}: {
		post: PublicPost;
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

	<footer
		class="flex items-center justify-between gap-sm pt-xs border-t border-border-card text-sm"
	>
		<a
			href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
			target="_blank"
			rel="license noopener noreferrer"
			class="text-xs text-foreground-alt hover:underline"
			title="Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 4.0"
		>
			Lizenz: CC BY-SA 4.0
		</a>

		{#if showFullContent}
			<a href="/lesen/{post.slug}/bearbeiten" class="text-taxi-blue hover:underline font-medium">
				Bearbeiten →
			</a>
		{:else}
			<a href="/lesen/{post.slug}" class="text-taxi-blue hover:underline font-medium">
				Weiterlesen →
			</a>
		{/if}
	</footer>
</article>
