<!--
  @component
  Table of contents built from a post's h2/h3 headings.
  Shown when a markdown file has `toc: true` in its frontmatter.
-->
<script lang="ts">
	import type { TocItem } from '$lib/types';

	let { items }: { items: TocItem[] } = $props();
</script>

<aside>
	<p><strong>Table of contents</strong></p>
	<ul>
		{#each items as item (item.id)}
			<li class:nested={item.depth === 3}>
				<a href="#{item.id}">{item.text}</a>
			</li>
		{/each}
	</ul>
</aside>

<style>
	aside {
		margin: 2rem 0 3rem;
		line-height: 1.2em;
	}

	ul {
		margin: 0;
		padding-left: 2rem;
	}

	li {
		margin: 0.1rem 0;
	}

	.nested {
		margin-left: 1.5rem;
	}
</style>
