<!--
  @component
  Sets the browser tab title and the meta tags used by search engines and link previews.
  Put one on every page: <Seo title="Posts" />
  Leave `title` out on the homepage to show just the site name.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config';

	let { title, description = site.description }: { title?: string; description?: string } =
		$props();

	const fullTitle = $derived(title ? `${title} | ${site.title}` : site.title);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title ?? site.title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={site.title} />
	<meta property="og:url" content={site.url + page.url.pathname} />
</svelte:head>
