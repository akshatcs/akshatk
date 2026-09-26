<!--
  @component
  Row of social media icons. Links come from `socials` in `$lib/config.ts`.
-->
<script lang="ts">
	import { socials } from '$lib/config';
	import Icon from './Icon.svelte';
</script>

<div class="social-icons">
	{#each socials as social (social.href)}
		<a href={social.href} title={social.label} aria-label={social.label} target="_blank" rel="noopener noreferrer me">
			<Icon name={social.icon} />
		</a>
	{/each}
</div>

<style>
	.social-icons {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding: 12px 0;
		margin-bottom: 3rem;
	}

	a {
		text-decoration: none;
	}

	@media (max-width: 640px) {
		.social-icons {
			margin-bottom: 0;
		}
	}
</style>
