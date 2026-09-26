<!--
  @component
  Wrapper for one-off pages written directly in a route (about, ai, …).
  Gives them the same title, text styling and "back to top" link as posts.

  Usage:
    <Page title="About">
      <p>Some text…</p>
    </Page>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Seo from './Seo.svelte';
	import BackToTop from './BackToTop.svelte';

	let {
		title,
		description,
		children
	}: { title: string; description?: string; children: Snippet } = $props();
</script>

<Seo {title} {description} />

<article>
	<h1>{title}</h1>
	<!-- "prose" applies the same text styles as blog posts (see app.css) -->
	<div class="prose">
		{@render children()}
	</div>
</article>

<BackToTop />

<style>
	h1 {
		margin: 1rem 0 2rem;
	}

	.prose {
		margin-bottom: 5rem;
	}
</style>
