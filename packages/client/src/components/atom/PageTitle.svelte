<script lang='ts'>
	import { config } from '$lib/store';

	export let name: string;

	$: serviceName = $config?.find((c: Config) => c.id === 'SERVICE').name ?? '사물함 시스템';
</script>

<svelte:head>
	<title>{name ? `${name} - ` : ''}{serviceName}</title>
</svelte:head>