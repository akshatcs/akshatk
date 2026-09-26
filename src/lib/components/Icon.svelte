<!--
  @component
  Renders one of the SVG icons defined in `icons.ts`.
  Usage: <Icon name="github" />
-->
<script lang="ts">
	import { icons, type IconName } from './icons';

	let { name, size = 20 }: { name: IconName; size?: number } = $props();
</script>

<svg viewBox={icons[name].viewBox} width={size} height={size} fill="currentColor" aria-hidden="true">
	<path d={icons[name].path} />
</svg>
