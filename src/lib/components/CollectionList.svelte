<!--
  @component
  A collection's list page (e.g. /posts/): heading, intro, entries, pagination.
  Shared by the first page and the /page/N/ pages.
-->
<script lang="ts">
	import { collections, type CollectionName } from '$lib/config';
	import type { EntryMeta } from '$lib/types';
	import Seo from './Seo.svelte';
	import EntryList from './EntryList.svelte';
	import Pagination from './Pagination.svelte';

	let {
		collection,
		entries,
		page,
		totalPages
	}: { collection: CollectionName; entries: EntryMeta[]; page: number; totalPages: number } =
		$props();

	const { title, intro } = $derived(collections[collection]);
</script>

<Seo title={page > 1 ? `${title} (page ${page})` : title} />

<section>
	<h1>{title}</h1>
	{#if intro}<p>{intro}</p>{/if}
	<EntryList {entries} />
	<Pagination {collection} {page} {totalPages} />
</section>

<style>
	section {
		padding-bottom: 3rem;
	}
</style>
