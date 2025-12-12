<script lang="ts">
	import { Button } from 'bits-ui';
	import { likePost } from '../../routes/lesen/data.remote';

	let {
		postId,
		initialCount = 0
	}: {
		postId: string;
		initialCount?: number;
	} = $props();

	let count = $state(initialCount);
	let hasLiked = $state(false);
	let isLiking = $state(false);

	async function handleLike() {
		if (hasLiked || isLiking) return;

		isLiking = true;
		// Optimistic update
		count++;
		hasLiked = true;

		try {
			await likePost(postId);
		} catch (error) {
			// Revert on error
			count--;
			hasLiked = false;
			console.error('Failed to like post:', error);
		} finally {
			isLiking = false;
		}
	}
</script>

<Button.Root
	onclick={handleLike}
	disabled={hasLiked || isLiking}
	class="flex items-center gap-2xs px-xs py-3xs rounded-button transition-all {hasLiked
		? 'text-tertiary'
		: 'text-foreground-alt hover:text-tertiary'} disabled:cursor-default"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill={hasLiked ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="w-[1.25em] h-[1.25em] transition-transform {hasLiked ? 'scale-110' : ''}"
	>
		<path
			d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
		/>
	</svg>
	<span class="text-sm font-medium">{count}</span>
</Button.Root>
