<script lang='ts'>
	import FloorStatus from '../../atom/FloorStatus.svelte';
	import Skeleton from '../../atom/Skeleton.svelte';

	export let departmentStatus;
</script>
{#if departmentStatus}
	<h3><span class='text-primary-800'>{departmentStatus.departmentName}</span> 층별 예약 현황</h3>
	<p>{departmentStatus.departmentName} 관련 문의: {departmentStatus.contact}</p>

	<div class='mt-5'>
		{#each Object.entries(departmentStatus?.floors ?? {}) as [key, value], index(key)}
			<FloorStatus class='my-2' floor={key} lockerLeft={value.lockerLeft}
									 totalLocker={value.totalLocker} />
		{/each}
	</div>
{:else}
	<div class='flex flex-col gap-1'>
		<Skeleton class='h-12 w-96 bg-gray-300 rounded-md' />
		<Skeleton class='h-6 w-56 bg-gray-300 rounded-md' />
	</div>
	<div class='mt-5'>
		<Skeleton class='h-12 w-full bg-gray-300 rounded-2xl my-2' />
		<Skeleton class='h-12 w-full bg-gray-300 rounded-2xl my-2' />
		<Skeleton class='h-12 w-full bg-gray-300 rounded-2xl my-2' />
	</div>
{/if}