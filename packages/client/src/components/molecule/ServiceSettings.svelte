<script lang='ts'>
	import { config } from '$lib/store';
	import BuildingEditor from './BuildingEditor.svelte';
	import DepartmentConfigEditor from './DepartmentConfigEditor.svelte';

	$: serviceConfig = $config ? $config.find(v => v.id === 'SERVICE') : undefined;

	let newServiceConfig: ServiceConfig;
	let buildings: { [buildingNum: string]: Building };
	$: if (serviceConfig) {
		newServiceConfig = { ...serviceConfig };
		buildings = { ...(serviceConfig as ServiceConfig).buildings };
	}
</script>

<div class='wrap'>
	<h3>서비스 설정</h3>
	<section class='card'>
		<h4>전체 서비스 설정</h4>
		{#if newServiceConfig}
			<div class='service'>
				<div class='form-group'>
					<label for='service_name'>서비스명</label>
					<input id='service_name' type='text'
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
				<div class='form-group'>
					<label for='activate_from'>예약 시작일</label>
					<input id='activate_from' type='datetime-local'
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
				<div class='form-group'>
					<label for='activate_to'>예약 종료일</label>
					<input id='activate_to' type='datetime-local'
								 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
				</div>
			</div>
		{:else}
			로드중
		{/if}
	</section>
	<section class='card'>
		<h4>건물/사물함 수정</h4>
		<BuildingEditor bind:buildings={buildings} />
	</section>
	<div class='card'>
		<h4>학부별 설정</h4>
		<DepartmentConfigEditor configs={$config} />
	</div>
</div>

<style>
    .wrap {
        @apply flex flex-col gap-3;
    }

    .card {
        @apply rounded-md shadow-md p-6 bg-white flex flex-col gap-3;

    }
		
    .form-group {
        @apply my-2;
    }

    .form-group label {
        @apply font-bold block mb-1;
    }
</style>