<script lang='ts'>
	import { config } from '$lib/store';
	import BuildingEditor from './BuildingEditor.svelte';

	$: serviceConfig = $config ? $config.find(v => v.id === 'SERVICE') : undefined;

	let newServiceConfig: ServiceConfig;
	let buildings: { [buildingNum: string]: Building };
	$: if (serviceConfig) {
		newServiceConfig = { ...serviceConfig };
		buildings = { ...(serviceConfig as ServiceConfig).buildings };
	} else if ($config && $config.find(v => v.id === 'SERVICE') === undefined) {
		newServiceConfig = {
			id: 'SERVICE',
			name: '사물함 시스템',
			buildings: {}
		};
		buildings = {};
	}
</script>

<div class='wrap'>
	<h3 class='title'>서비스 설정</h3>
	<section class='card'>
		<h4>전체 서비스 설정</h4>
		{#if newServiceConfig}
			<div class='service'>
				<div class='form-group'>
					<label for='service_name'>서비스명</label>
					<input id='service_name' type='text'
								 value={newServiceConfig?.name ?? ''}
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
				<div class='form-group'>
					<label for='activate_from'>예약 시작일</label>
					<input id='activate_from' type='datetime-local'
								 value={(newServiceConfig?.activateFrom ?? '').replace('Z', '')}
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
				<div class='form-group'>
					<label for='activate_to'>예약 종료일</label>
					<input id='activate_to' type='datetime-local'
								 value={(newServiceConfig?.activateTo ?? '').replace('Z', '')}
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
			</div>
		{:else}
			로드중
		{/if}
	</section>
	<section class='card'>
		<h4>건물/사물함 수정</h4>
		<BuildingEditor {buildings} />
	</section>
</div>

<style>
    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3;
    }

    .title {
        @apply mx-6 md:mx-0;
    }

    .card {
        @apply rounded-md shadow-md p-6 bg-white flex flex-col gap-3;

    }

    .form-group {
        @apply my-2 flex flex-col items-start;
    }

    .form-group label {
        @apply font-bold block mb-1;
    }
</style>