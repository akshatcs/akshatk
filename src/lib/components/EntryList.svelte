<!--
  @component
  A list of dated links — used for posts, talks and projects.
  Usage: <EntryList entries={posts} />
-->
<script lang="ts">
	import type { EntryMeta } from '$lib/types';
	import { formatShortDate } from '$lib/utils/date';
	import { entryUrl } from '$lib/utils/urls';

	let { entries }: { entries: EntryMeta[] } = $props();
</script>

<ul>
	{#each entries as entry (entry.slug)}
		<li>
			<span class="date">
				{#if entry.date}
					<time datetime={entry.date}>{formatShortDate(entry.date)}</time>
				{/if}
			</span>
			<a href={entryUrl(entry)}>
				{entry.title}
				{#if entry.draft}<small>(draft)</small>{/if}
			</a>
		</li>
	{:else}
		<li>Nothing here yet.</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		display: flex;
		align-items: baseline;
		margin-bottom: 0.5rem;
		line-height: 1.3em;
	}

	.date {
		flex-shrink: 0;
		width: 120px;
		padding-right: 1rem;
		text-align: right;
		font-family: var(--font-mono);
		font-size: small;
	}
</style>
