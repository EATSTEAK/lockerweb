<script lang='ts'>

	import Tag from '../../atom/Tag.svelte';
	import DepartmentSelectionGroup from '../../atom/DepartmentSelectionGroup.svelte';
	import DepartmentSelection from '../../atom/DepartmentSelection.svelte';
	import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';

	export let lockerCount;

	let selectedDept = lockerCount ? Object.keys(lockerCount)[0] : undefined;
	$: departmentStatus = selectedDept ? lockerCount[selectedDept] : undefined;
	$: availableDates = [];


	function availableCalc(activateFrom: Date, activateTo: Date): string {
		const fromDate = activateFrom ? `${activateFrom.getMonth() + 1}/${activateFrom.getDate()}` : '';
		const toDate = activateTo ? `${activateTo.getMonth() + 1}/${activateTo.getDate()}` : '';
		const fromTime = activateFrom ? `${activateFrom.getHours()}:${activateFrom.getMinutes()}` : '';
		const toTime = activateTo ? `${activateTo.getHours()}:${activateTo.getMinutes()}` : '';
		const isToDateDifferent = toDate && toDate !== fromDate;
		return `${fromDate} ${fromTime} ~ ${isToDateDifferent ? `${toDate} ` : ''}${toTime}`;
	}
</script>

<div class='wrap'>
	<div class='control'>
		<div class='title'>
			<h3>사물함 예약 현황</h3>
			<Tag class='bg-gray-200 text-primary-800'>{new Date().getMonth() + 1}/{new Date().getDate()}</Tag>
		</div>
		<div class='selection'>
			<DepartmentSelectionGroup bind:selectedId={selectedDept}>
				{#each Object.entries(lockerCount ?? {}) as [key, value], index(key)}
					<DepartmentSelection id={key} departmentText={value.departmentName} lockerLeft={value.lockerLeft}
															 totalLocker={value.totalLocker}
															 availableTime={availableCalc(value.activateFrom, value.activateTo)} />
				{/each}
			</DepartmentSelectionGroup>
		</div>
	</div>
	<div class='tab'>
		<DepartmentLockerStatus {departmentStatus} />
	</div>
</div>

<style>
    .wrap {
        @apply flex flex-col gap-7;
    }

    .control {
        @apply flex flex-col gap-3;
    }

    .title {
        @apply flex items-center gap-3;
    }
</style>