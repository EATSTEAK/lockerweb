<script lang='ts'>

	import Tag from '../../atom/Tag.svelte';
	import DepartmentSelectionGroup from '../../atom/DepartmentSelectionGroup.svelte';
	import DepartmentSelection from '../../atom/DepartmentSelection.svelte';
	import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';
	import Skeleton from '../../atom/Skeleton.svelte';

	export let lockerCount;

	let selectedDept;
	$: if (lockerCount) {
		selectedDept = Object.keys(lockerCount)[0];
	}
	$: departmentStatus = selectedDept ? lockerCount[selectedDept] : undefined;
	$: availableDates = [];
</script>

<div class='flex flex-col gap-7'>
	<div class='flex flex-col gap-3'>
		<div class='flex items-center gap-3'>
			<h3>사물함 예약 현황</h3>
			<Tag class='bg-gray-200 text-primary-800'>{new Date().getMonth() + 1}/{new Date().getDate()}</Tag>
		</div>
		<div class='selection'>
			{#if lockerCount && Object.keys(lockerCount).length}
				<DepartmentSelectionGroup bind:selectedId={selectedDept}>
					{#each Object.entries(lockerCount ?? {}) as [key, value], index(key)}
						<DepartmentSelection id={key} departmentText={value.departmentName} lockerLeft={value.lockerLeft}
																 totalLocker={value.totalLocker}
																 activateFrom={value.activateFrom}
																 activateTo={value.activateTo} />
					{/each}
				</DepartmentSelectionGroup>
			{:else}
				<div class='flex gap-2 py-2 overflow-x-scroll overflow-y-hidden'>
					<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-300 rounded-2xl' />
					<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-300 rounded-2xl' />
					<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-300 rounded-2xl' />
					<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-300 rounded-2xl' />
					<Skeleton class='w-[160px] h-[160px] basis-[160px] grow-0 shrink-0 bg-gray-300 rounded-2xl' />
				</div>
			{/if}
		</div>
	</div>
	<div class='tab'>
		<DepartmentLockerStatus {departmentStatus} />
	</div>
</div>