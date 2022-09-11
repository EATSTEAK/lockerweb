<script lang='ts'>
	import FloorStatus from '../../atom/FloorStatus.svelte';
	import Tag from '../../atom/Tag.svelte';
	import type { DepartmentLockerCount } from '$lib/types';

	export let departmentStatus: DepartmentLockerCount;

	$: flatLockers = Object.entries(departmentStatus?.lockers ?? {}).flatMap(
		([buildingNum, floors]) =>
			Object.entries(floors).map(([floor, status]) => [buildingNum, floor, status])
	);
</script>

<h3><span class='text-primary-800'>{departmentStatus.departmentName}</span> 층별 예약 현황</h3>
<div class='flex gap-1 mt-2 items-center'>
	<Tag class='block shrink-0 bg-gray-200'>문의 사항</Tag>
	<p>{departmentStatus.contact}</p>
</div>

<div class='mt-5'>
	{#each flatLockers as [building, floor, status], index (floor)}
		<FloorStatus
			class='my-2'
			{building}
			{floor}
			lockerLeft={status.lockerLeft}
			totalLocker={status.totalLocker}
		/>
	{/each}
</div>
