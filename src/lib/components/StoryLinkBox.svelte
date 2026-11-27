<script lang="ts">
	import { page } from '$app/state';

	let { slug }: { slug: string } = $props();

	let linkCopied = $state(false);

	// The story page shows the review status, so this link replaces a separate status page
	const storyPath = $derived(`/lesen/${slug}`);
	const storyUrl = $derived(`${page.url.origin}${storyPath}`);

	function handleCopyLink() {
		navigator.clipboard.writeText(storyUrl).then(() => {
			linkCopied = true;
			setTimeout(() => {
				linkCopied = false;
			}, 2000);
		});
	}
</script>

<div class="p-sm bg-background rounded-card border border-border">
	<p class="font-bold mb-xs text-sm">Link zu deiner Geschichte:</p>
	<div class="flex flex-col sm:flex-row sm:items-center gap-xs mb-sm">
		<code class="flex-1 px-sm py-xs bg-background-alt rounded text-sm font-mono break-all">
			{storyUrl}
		</code>
		<button
			type="button"
			onclick={handleCopyLink}
			class="px-sm py-xs bg-taxi-blue text-taxi-yellow rounded-button text-sm font-medium hover:opacity-90 transition-opacity"
		>
			{linkCopied ? '✓ Kopiert' : 'Kopieren'}
		</button>
	</div>
	<p class="text-xs text-foreground-alt mb-sm">
		Unter diesem Link siehst du jederzeit, ob deine Geschichte schon freigegeben wurde. Speichere
		ihn dir am besten zusammen mit deinem Geheimcode.
	</p>
	<a
		href={storyPath}
		class="block w-full px-sm py-xs bg-taxi-blue text-taxi-yellow rounded-button text-sm font-medium text-center hover:opacity-90 transition-opacity"
	>
		Zur Geschichte
	</a>
</div>
