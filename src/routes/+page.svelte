<!-- Homepage: intro, social icons, latest posts. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import SocialIcons from '$lib/components/SocialIcons.svelte';
	import EntryList from '$lib/components/EntryList.svelte';

	let { data } = $props();
</script>

<Seo />


<section class="prose">
	<h1>👋🏻Welcome!</h1>

	<p>
		I'm Akshat! An engineer working at the intersection of intelligent systems and distributed systems. 
		I care deeply about building technology that not only works, but truly matters.
	</p>

	<p>I've written more about me at <a href={resolve('/about/')}>here</a> if you're interested :)</p>
</section>

<SocialIcons />

<section class="posts">
	<h1>Posts</h1>
	<EntryList entries={data.posts} />
</section>

<style>
	.posts {
		padding-bottom: 3rem;
	}
</style>

