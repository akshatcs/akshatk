<!-- Shown for missing pages (404) and any other error. -->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title={page.status === 404 ? 'Not found' : 'Error'} />

<div>
	{#if page.status === 404}
		<h1>404</h1>
		<p>This page doesn't exist. <a href={resolve('/')}>Go back home</a>.</p>
	{:else}
		<h1>{page.status}</h1>
		<p>{page.error?.message}</p>
	{/if}
</div>

<style>
	div {
		text-align: center;
	}

	h1 {
		font-size: 6rem;
		margin-bottom: 3rem;
	}
</style>
