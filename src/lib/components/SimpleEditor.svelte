<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	let {
		content = '',
		onUpdate,
		class: className = ''
	}: {
		content?: string;
		onUpdate?: (html: string) => void;
		class?: string;
	} = $props();

	let element: HTMLElement;
	let editor: Editor | undefined = $state();

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({
					// Disable features we don't need
					heading: false,
					codeBlock: false,
					blockquote: false,
					bulletList: false,
					orderedList: false,
					listItem: false,
					horizontalRule: false,
					code: false,
					strike: false
				})
			],
			content,
			onUpdate: ({ editor }) => {
				onUpdate?.(editor.getHTML());
			},
			onTransaction: ({ editor: e }) => {
				editor = e;
			},
			editorProps: {
				attributes: {
					class: 'prose prose-sm focus:outline-none min-h-[200px] p-sm'
				}
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	export function getHTML(): string {
		return editor?.getHTML() ?? '';
	}

	export function isEmpty(): boolean {
		return editor?.isEmpty ?? true;
	}
</script>

<div class="simple-editor {className}">
	<!-- Minimal toolbar -->
	<div class="flex gap-2xs border-b border-border-card p-2xs bg-muted">
		<button
			type="button"
			onclick={toggleBold}
			class="px-xs py-3xs rounded-button hover:bg-dark-10 transition-colors {editor?.isActive(
				'bold'
			)
				? 'bg-dark-10 font-bold'
				: ''}"
			title="Fett (Ctrl+B)"
		>
			<span class="font-bold">B</span>
		</button>
		<button
			type="button"
			onclick={toggleItalic}
			class="px-xs py-3xs rounded-button hover:bg-dark-10 transition-colors {editor?.isActive(
				'italic'
			)
				? 'bg-dark-10 italic'
				: ''}"
			title="Kursiv (Ctrl+I)"
		>
			<span class="italic">I</span>
		</button>
	</div>

	<!-- Editor area -->
	<div
		bind:this={element}
		class="bg-background border border-border-card border-t-0 rounded-b-input min-h-[200px]"
	></div>
</div>

<style>
	.simple-editor :global(.ProseMirror) {
		min-height: 200px;
		padding: var(--spacing-sm);
		outline: none;
	}

	.simple-editor :global(.ProseMirror p) {
		margin-bottom: var(--spacing-xs);
	}

	.simple-editor :global(.ProseMirror p:last-child) {
		margin-bottom: 0;
	}

	.simple-editor :global(.ProseMirror-focused) {
		outline: none;
	}
</style>
