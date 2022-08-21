<script lang='ts'>
	import { config } from '$lib/store';
	import BuildingEditor from './BuildingEditor.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import ArrowUndo from '../../../../icons/ArrowUndo.svelte';

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
	<div class='title'>
		<h3>서비스 설정</h3>
		<div class='service-control'>
			<Button class='bg-white text-gray-700' isIconRight>
				되돌리기
				<ArrowUndo slot='icon' />
			</Button>
			<Button class='bg-primary-800 text-white' isIconRight>
				저장
				<SaveEdit slot='icon' />
			</Button>
		</div>
	</div>
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
        @apply mx-6 md:mx-0 flex flex-wrap items-start;
    }

    .service-control {
        @apply grow flex justify-end gap-1;
    }

    .card {
        @apply md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3;

    }
</style>