<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Article from '$lib/components/Article.svelte';
	import EntryNav from '$lib/components/EntryNav.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';

	let { data } = $props();
</script>

<Seo title={data.entry.title} description={data.entry.summary} />

<Article entry={data.entry} />
<EntryNav older={data.older} newer={data.newer} />
<BackToTop />
