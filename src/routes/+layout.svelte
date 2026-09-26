<script lang="ts">
	import '../app.css';
	import 'katex/dist/katex.min.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="page">
	<Header />
	<main>
		{@render children()}
	</main>
</div>
<Footer />

<style>
	/* Pushes the footer to the bottom of the window on short pages. */
	.page {
		min-height: calc(100vh - 3rem);
	}
</style>
