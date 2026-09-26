<!--
  @component
  A full article: title, optional summary, date and reading time, optional
  table of contents, then the content. Used for posts, talks, projects and
  standalone pages like /about.
  Usage: <Article entry={entry} />
-->
<script lang="ts">
	import type { Entry } from '$lib/types';
	import { formatLongDate } from '$lib/utils/date';
	import Prose from './Prose.svelte';
	import TableOfContents from './TableOfContents.svelte';

	let { entry }: { entry: Entry } = $props();
</script>

<article>
	<header>
		<h1>{entry.title}</h1>
		{#if entry.summary}
			<p class="muted">{entry.summary}</p>
		{/if}
		{#if entry.date}
			<p class="muted meta">
				<time datetime={entry.date}>{formatLongDate(entry.date)}</time>
				&nbsp;·&nbsp; {entry.readingTime} min read
			</p>
		{/if}
	</header>

	{#if entry.toc && entry.tocItems.length > 0}
		<TableOfContents items={entry.tocItems} />
	{/if}

	<div class="content">
		<Prose html={entry.html} />
	</div>
</article>

<style>
	header {
		margin: 1rem 0 2rem;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.muted {
		margin: 0;
		color: var(--color-text-muted);
	}

	.meta {
		margin-top: 0.8rem;
	}

	.content {
		margin-bottom: 5rem;
	}
</style>
