<script lang='ts'>
	import BuildingEditor from './BuildingEditor.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import ArrowUndo from '../../../../icons/ArrowUndo.svelte';
	import isEqual from 'lodash.isequal';
	import { fetchWithAuth } from '$lib/auth';
	import { variables } from '$lib/variables';
	import { config } from '$lib/store';
	import UpdateScreen from '../../../atom/UpdateScreen.svelte';

	$: serviceConfig = $config ? $config.find(v => v.id === 'SERVICE') : undefined;

	let updating = false;

	let name;
	let activateFrom;
	let activateTo;
	let buildings;

	$: if (serviceConfig) {
		initializeValues();
		updating = false;
	}

	$: newConfig = {
		id: 'SERVICE',
		name,
		...(activateFrom && { activateFrom: activateFrom.toISOString() }),
		...(activateTo && { activateTo: activateTo.toISOString() }),
		buildings
	};

	$: isModified = !!serviceConfig && !isEqual(serviceConfig, newConfig);

	$: isAppliable = isModified && name;

	$: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

	function initializeValues() {
		name = serviceConfig?.name ?? '';
		activateFrom = serviceConfig?.activateFrom ? new Date(serviceConfig?.activateFrom) : undefined;
		activateTo = serviceConfig?.activateTo ? new Date(serviceConfig?.activateTo) : undefined;
		buildings = serviceConfig?.buildings ?? {};
	}

	function updateConfig() {
		updating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/config/update', {
			method: 'POST',
			body: JSON.stringify(newConfig)
		}).then(res => res.json())
			.then(res => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error(res.errorDescription);
				}
			})
			.catch(err => {
				console.error(err);
				updating = false;
			});
	}

</script>

<div class='wrap'>
	<div class='title'>
		<h3>서비스 설정</h3>
		<div class='service-control'>
			<Button on:click={initializeValues} disabled={!isModified ? true : undefined}
							class='bg-white text-gray-700 [&[disabled]]:opacity-[0.5]'
							isIconRight>
				되돌리기
				<ArrowUndo slot='icon' />
			</Button>
			<Button on:click={updateConfig} disabled={isSaveDisabled}
							class='bg-primary-800 text-white [&[disabled]]:opacity-[0.5]' isIconRight>
				저장
				<SaveEdit slot='icon' />
			</Button>
		</div>
	</div>
	{#if updating}
		<UpdateScreen class='min-h-[32rem] md:rounded-md' />
	{:else}
		<section class='card'>
			<h4>전체 서비스 설정</h4>
			<div class='service'>
				{#if serviceConfig}
					<TextInput class='my-2' inputClass='reactive-input' id='name' label='서비스 이름' showLabel
										 bind:value={name} required invalidClass='text-red-800' invalidText='이 값은 필수입니다.' />
					<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_from' label='예약 시작일' showLabel
												 bind:value={activateFrom} invalidClass='text-red-800' />
					<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_to' label='예약 종료일' showLabel
												 bind:value={activateTo} invalidClass='text-red-800' />
				{:else}
					<div class='flex flex-col gap-1 my-2'>
						<div class='card-placeholder h-4 w-24'></div>
						<div class='card-placeholder h-8 w-96'></div>
					</div>
					<div class='flex flex-col gap-1 my-2'>
						<div class='card-placeholder h-4 w-24'></div>
						<div class='card-placeholder h-8 w-96'></div>
					</div>
					<div class='flex flex-col gap-1 my-2'>
						<div class='card-placeholder h-4 w-24'></div>
						<div class='card-placeholder h-8 w-96'></div>
					</div>
				{/if}
			</div>
		</section>
		<section class='card'>
			<h4>건물/사물함 수정</h4>
			{#if serviceConfig}
				<BuildingEditor bind:buildings />
			{:else}
				<div class='card-placeholder w-full min-h-[32rem]'></div>
			{/if}
		</section>
	{/if}
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

    .card-placeholder {
        @apply md:rounded-md bg-gray-400 animate-pulse;
    }
</style>