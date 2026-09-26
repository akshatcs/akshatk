<script lang="ts">
	import CollectionList from '$lib/components/CollectionList.svelte';

	let { data } = $props();
</script>

<CollectionList {...data} />
