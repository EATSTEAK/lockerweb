<script lang='ts'>
	import BuildingEditor from './BuildingEditor.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import ArrowUndo from '../../../../icons/ArrowUndo.svelte';
	import isEqual from 'lodash.isequal';
	import { getServiceConfig, apiUpdateConfig } from '$lib/api/config';
	import { config } from '$lib/store';
	import UpdateScreen from '../../../atom/UpdateScreen.svelte';
	import Warning from '../../../../icons/Warning.svelte';
	import Skeleton from "../../../atom/Skeleton.svelte";

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

	$: isServiceReady = !!($config && $config.success && $config.result.find(v => v.id === 'SERVICE'));

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

	$: isBuildingModified = !isEqual(serviceConfig?.buildings ?? {}, buildings);

	function initializeValues() {
		name = serviceConfig?.name ?? '';
		activateFrom = serviceConfig?.activateFrom ?? null;
		activateTo = serviceConfig?.activateTo ?? null;
		buildings = { ...(serviceConfig?.buildings ?? {}) };
	}

	function updateConfig() {
		updating = true;
		apiUpdateConfig(newConfig)
			.then(res => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error((res as ErrorResponse<LockerError>).error);
				}
			})
			.catch(err => {
				console.error(err);
				updating = false;
			});
	}

</script>

<div class='my-8 md:mx-8 flex flex-col gap-3'>
	<div class='mx-6 md:mx-0 flex flex-wrap items-start'>
		<h3>서비스 설정</h3>
		<div class='grow flex justify-end gap-1'>
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
	{#if serviceConfig && !isServiceReady}
		<div class='bg-red-300 rounded-md p-6 flex gap-3'>
			<Warning />
			<div class='grow'>
				<span class='font-bold'>주의:</span> 현재 서비스가 설정되지 않은 상태입니다. 서비스 이름을 포함한 설정을 저장하여 설정해 주세요.
			</div>
		</div>
	{/if}
	{#if updating}
		<UpdateScreen class='min-h-[32rem] md:rounded-md' />
	{:else}
		<section class='md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3'>
			<h4>전체 서비스 설정</h4>
			<div class='service'>
				{#if serviceConfig}
					<TextInput class='my-2' inputClass='w-full max-w-sm' id='name' label='서비스 이름' showLabel
										 bind:value={name} required invalidClass='text-red-800' invalidText='이 값은 필수입니다.' />
					<DateTimeInput class='my-2' inputClass='w-full max-w-sm' id='activate_from' label='예약 시작일' showLabel
												 bind:value={activateFrom} invalidClass='text-red-800' />
					<DateTimeInput class='my-2' inputClass='w-full max-w-sm' id='activate_to' label='예약 종료일' showLabel
												 bind:value={activateTo} invalidClass='text-red-800' />
				{:else}
					<div class='flex flex-col gap-1 my-2'>
						<Skeleton class='md:rounded-md bg-gray-200 h-4 w-24'></Skeleton>
						<Skeleton class='md:rounded-md bg-gray-200 h-8 w-96'></Skeleton>
					</div>
					<div class='flex flex-col gap-1 my-2'>
						<Skeleton class='md:rounded-md bg-gray-200 h-4 w-24'></Skeleton>
						<Skeleton class='md:rounded-md bg-gray-200 h-8 w-96'></Skeleton>
					</div>
					<div class='flex flex-col gap-1 my-2'>
						<Skeleton class='md:rounded-md bg-gray-200 h-4 w-24'></Skeleton>
						<Skeleton class='md:rounded-md bg-gray-200 h-8 w-96'></Skeleton>
					</div>
				{/if}
			</div>
		</section>
		<section class='md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3'>
			<h4>건물/사물함 수정</h4>
			{#if serviceConfig && isBuildingModified}
				<div class='bg-primary-200 rounded-md p-6 flex gap-3'>
					<Warning />
					<div class='grow'>
						<span class='font-bold'>주의:</span> 변경된 건물 정보가 저장되지 않았습니다. 편집을 완료한 이후 우상단 <span class='font-bold'>저장</span>
						버튼을 눌러 저장하였는지 확인하세요.
					</div>
				</div>
			{/if}
			{#if serviceConfig}
				<BuildingEditor bind:buildings />
			{:else}
				<Skeleton class='md:rounded-md bg-gray-200 w-full min-h-[32rem]'></Skeleton>
			{/if}
		</section>
	{/if}
</div>