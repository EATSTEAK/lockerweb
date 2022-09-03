<script lang='ts'>

	import Tag from '../../atom/Tag.svelte';
	import DepartmentSelectionGroup from '../../atom/DepartmentSelectionGroup.svelte';
	import DepartmentSelection from '../../atom/DepartmentSelection.svelte';
	import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';

	export let lockerCount;

	let selectedDept;
	$: if (lockerCount) {
		selectedDept = Object.keys(lockerCount)[0];
	}
	$: departmentStatus = selectedDept ? lockerCount[selectedDept] : undefined;
	$: availableDates = [];
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
															 activateFrom={value.activateFrom}
															 activateTo={value.activateTo} />
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