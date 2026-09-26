<!--
  @component
  Displays HTML rendered from markdown, styled by the `.prose` rules in app.css.
  Also makes the "copy" buttons on code blocks work.
  Usage: <Prose html={entry.html} />
-->
<script lang="ts">
	let { html }: { html: string } = $props();

	// One click handler for the whole block instead of one per button.
	async function handleClick(event: MouseEvent) {
		const button = (event.target as HTMLElement).closest('.copy-code-button');
		const code = button?.parentElement?.querySelector('code');
		if (!button || !code) return;

		await navigator.clipboard.writeText(code.innerText);
		button.textContent = 'copied';
		setTimeout(() => (button.textContent = 'copy'), 1000);
	}
</script>

<!-- The HTML is generated at build time from your own markdown files, so it's safe to insert. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="prose" onclick={handleClick}>
	{@html html}
</div>

<style>
	/* :global because these elements come from {@html}, which Svelte can't see at compile time */
	.prose :global(.copy-code-button) {
		position: absolute;
		top: 10px;
		right: 10px;
		display: none;
		padding: 3px 6px;
		font-family: var(--font-mono);
		font-size: 0.8em;
		color: inherit;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 7px;
		cursor: pointer;
	}

	/* Show the button when hovering the code block, or when it's focused with the keyboard. */
	.prose :global(pre:hover .copy-code-button),
	.prose :global(.copy-code-button:focus-visible) {
		display: block;
	}

	/* Touch screens have no hover, so always show it there. */
	@media (hover: none) {
		.prose :global(.copy-code-button) {
			display: block;
		}
	}
</style>
