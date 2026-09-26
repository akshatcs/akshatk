<!--
  @component
  Site title and top menu. Menu items come from `nav` in `$lib/config.ts`.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { site, nav } from '$lib/config';
</script>

<header id="top">
	<p class="title"><a href={resolve('/')}>{site.title}</a></p>

	<nav aria-label="Main">
		{#each nav as item (item.href)}
			{@const href = resolve(item.href as '/')}
			<a {href} aria-current={page.url.pathname === href ? 'page' : undefined}>
				{item.label}
			</a>
		{/each}
	</nav>
</header>

<style>
	header {
		padding-top: 4rem;
		margin-bottom: 2rem;
	}

	.title {
		margin: 0;
		font-size: 2.2em;
		font-weight: 700;
		line-height: 1.2;
	}

	.title a {
		text-decoration: none;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1rem;
		padding-top: 1rem;
		font-family: var(--font-mono);
		font-size: 0.8em;
	}

	/* the menu item for the page you're on */
	nav a[aria-current='page'] {
		font-weight: 700;
	}

	@media (max-width: 1024px) {
		header {
			padding-top: 1rem;
		}
	}
</style>
