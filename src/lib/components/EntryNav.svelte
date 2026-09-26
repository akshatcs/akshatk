<!--
  @component
  "← older post | newer post →" links at the bottom of a post.
  Usage: <EntryNav older={olderEntry} newer={newerEntry} />
-->
<script lang="ts">
	import type { EntryMeta } from '$lib/types';
	import { entryUrl } from '$lib/utils/urls';

	let { older, newer }: { older: EntryMeta | null; newer: EntryMeta | null } = $props();
</script>

{#if older || newer}
	<nav aria-label="More posts">
		<div class="older">
			{#if older}
				<span class="label">← older</span>
				<a href={entryUrl(older)} rel="prev">{older.title}</a>
			{/if}
		</div>
		<div class="newer">
			{#if newer}
				<span class="label">newer →</span>
				<a href={entryUrl(newer)} rel="next">{newer.title}</a>
			{/if}
		</div>
	</nav>
{/if}

<style>
	/* Two columns: older post on the left, newer post on the right. */
	nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 3rem 0;
		padding: 1.25rem 0;
		border-block: 1px solid var(--color-border);
		line-height: 1.3em;
	}

	.newer {
		text-align: right;
	}

	.label {
		display: block;
		margin-bottom: 0.3rem;
		font-family: var(--font-mono);
		font-size: small;
		color: var(--color-text-muted);
	}

	/* On phones, stack them: older on top, newer below. */
	@media (max-width: 640px) {
		nav {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}

		.newer {
			text-align: left;
		}

		/* Hide the empty box when there's only one neighbour, so there's no stray gap. */
		.older:empty,
		.newer:empty {
			display: none;
		}
	}
</style>
