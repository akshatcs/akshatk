<!--
  @component
  "prev  2/5  next" controls under a list. Hidden when there's only one page.
  Page 1 lives at /posts/, page 2 at /posts/page/2/, and so on.
  Usage: <Pagination collection="posts" page={2} totalPages={5} />
-->
<script lang="ts">
	import type { CollectionName } from '$lib/config';
	import { collectionUrl } from '$lib/utils/urls';

	let {
		collection,
		page,
		totalPages
	}: { collection: CollectionName; page: number; totalPages: number } = $props();
</script>

{#if totalPages > 1}
	<nav aria-label="Pagination">
		<span class="control">
			{#if page > 1}<a href={collectionUrl(collection, page - 1)} rel="prev">prev</a>{/if}
		</span>
		<span class="current" aria-current="page">{page}/{totalPages}</span>
		<span class="control">
			{#if page < totalPages}<a href={collectionUrl(collection, page + 1)} rel="next">next</a>{/if}
		</span>
	</nav>
{/if}

<style>
	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.control,
	.current {
		min-width: 3rem;
		text-align: center;
	}

	.current {
		font-weight: 700;
	}
</style>
