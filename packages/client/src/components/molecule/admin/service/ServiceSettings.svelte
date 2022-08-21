<script lang='ts'>
	import { config } from '$lib/store';
	import BuildingEditor from './BuildingEditor.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';

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
				<TextInput class='my-2' inputClass='reactive-input' id='name' label='서비스 이름' showLabel
									 value={newServiceConfig?.name ?? ''} />
				<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_from' label='예약 시작일' showLabel
											 value={newServiceConfig?.activateFrom ? new Date(newServiceConfig?.activateFrom) : undefined} />
				<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_to' label='예약 종료일' showLabel
											 value={newServiceConfig?.activateTo ? new Date(newServiceConfig?.activateTo) : undefined} />
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
    .service :global(.reactive-input) {
        @apply w-full max-w-sm;
    }

    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3;
    }

    .title {
        @apply mx-6 md:mx-0;
    }

    .card {
        @apply md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3;

    }
</style>