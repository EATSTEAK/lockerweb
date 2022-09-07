<script lang='ts'>
	import { config } from '$lib/store';

	export let name: string = null;

	let serviceName = '사물함 예약 시스템';
	$: if ($config && $config.success) {
		serviceName = ($config.result ?? []).find((c: Config) => c.id === 'SERVICE')?.name ?? '사물함 예약 시스템';
	}
</script>

<svelte:head>
	<title>{name ? `${name} - ` : ''}{serviceName}</title>
</svelte:head>