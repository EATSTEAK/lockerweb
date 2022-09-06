<script lang='ts'>
	import { getBuildingName } from '$lib/utils';
	import { config } from '$lib/store';
	import { getServiceConfig } from '$lib/api/config';

	export let selectedBuildingId: string;
	export let selectedFloor: string;

	let alt = '배치도';

	$: if ($config.success && selectedBuildingId) {
		const serviceConfig = getServiceConfig($config?.result);
		alt = `${getBuildingName(serviceConfig.buildings, selectedBuildingId)} ${selectedFloor}층 배치도`;
	}
</script>
<img class='max-w-full h-auto max-h-[370px]' src='/floorMaps/{selectedBuildingId}-{selectedFloor}.svg' {alt}
		 aria-level={alt}>