<script lang='ts'>

	import Tag from '../../atom/Tag.svelte';
	import DepartmentSelectionGroup from '../../atom/DepartmentSelectionGroup.svelte';
	import DepartmentSelection from '../../atom/DepartmentSelection.svelte';
	import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';
	import Skeleton from '../../atom/Skeleton.svelte';
	import QuestionCircle from '../../../icons/QuestionCircle.svelte';
	import { fade } from 'svelte/transition';

	export let lockerCount;

	let selectedDept;
	$: if (lockerCount) {
		selectedDept = Object.keys(lockerCount)[0];
	}
	$: departmentStatus = selectedDept ? lockerCount[selectedDept] : undefined;
	$: availableDates = [];
</script>

<div class='flex flex-col gap-7 h-full'>
	<div class='flex flex-col gap-3'>
		<div class='flex items-center gap-3'>
			<h3>사물함 예약 현황</h3>
			<Tag class='bg-gray-200 text-primary-800'>{new Date().getMonth() + 1}/{new Date().getDate()}</Tag>
		</div>
		{#if lockerCount}
			<div transition:fade class='overflow-x-auto'>
				<DepartmentSelectionGroup bind:selectedId={selectedDept}>
					{#each Object.entries(lockerCount ?? {}) as [key, value], index(key)}
						<DepartmentSelection id={key} departmentText={value.departmentName} lockerLeft={value.lockerLeft}
																 totalLocker={value.totalLocker}
																 activateFrom={value.activateFrom}
																 activateTo={value.activateTo} />
					{/each}
				</DepartmentSelectionGroup>
			</div>
		{:else}
			<div class='flex gap-2 py-2 overflow-x-auto overflow-y-hidden'>
				<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-200 rounded-2xl' />
				<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-200 rounded-2xl' />
				<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-200 rounded-2xl' />
				<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-200 rounded-2xl' />
				<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-200 rounded-2xl' />
			</div>
		{/if}
	</div>
	<div class='grow'>
		{#if departmentStatus}
			<div transition:fade>
				<DepartmentLockerStatus {departmentStatus} />
			</div>
		{:else if !lockerCount}
			<div class='flex flex-col gap-1'>
				<Skeleton class='h-12 w-96 bg-gray-200 rounded-md' />
				<Skeleton class='h-6 w-56 bg-gray-200 rounded-md' />
			</div>
			<div class='mt-5'>
				<Skeleton class='h-12 w-full bg-gray-200 rounded-2xl my-2' />
				<Skeleton class='h-12 w-full bg-gray-200 rounded-2xl my-2' />
				<Skeleton class='h-12 w-full bg-gray-200 rounded-2xl my-2' />
			</div>
		{:else}
			<div transition:fade
					 class='rounded-md h-full bg-primary-200 text-gray-700 flex flex-col justify-center items-center'>
				<div class='flex flex-col gap-1 items-start'>
					<div class='flex flex-row gap-2 items-center'>
						<QuestionCircle class='w-16 h-16' />
						<h1>정보 없음</h1>
					</div>
					<p>예약 정보가 없습니다. 관리자라면 학과(부) 및 사물함 설정을 확인하세요.</p>
				</div>
			</div>
		{/if}
	</div>
</div>