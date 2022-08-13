<script lang='ts'>

	import Tag from '../atom/Tag.svelte';
	import DepartmentSelectionGroup from '../atom/DepartmentSelectionGroup.svelte';
	import DepartmentSelection from '../atom/DepartmentSelection.svelte';
	import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';

	let selectedDept;
</script>

<div class='wrap'>
	<div class='control'>
		<div class='title'>
			<h3>사물함 예약 현황</h3>
			<Tag class='bg-gray-200 text-primary-800'>8/13</Tag>
		</div>
		<div class='selection'>
			<DepartmentSelectionGroup bind:selectedId={selectedDept}>
				<DepartmentSelection id='C' departmentText='컴퓨터학부' lockerLeft={50} totalLocker={50} />
				<DepartmentSelection id='S' departmentText='소프트웨어학부' lockerLeft={20} totalLocker={50} />
				<DepartmentSelection id='G' departmentText='글로벌미디어학부' lockerLeft={20} totalLocker={50} />
				<DepartmentSelection id='E' departmentText='전자정보공학부' lockerLeft={20} totalLocker={50} />
				<DepartmentSelection id='A' departmentText='AI융합학부' lockerLeft={20} totalLocker={50} />
			</DepartmentSelectionGroup>
		</div>
	</div>
	<div class='tab'>
		<DepartmentLockerStatus />
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