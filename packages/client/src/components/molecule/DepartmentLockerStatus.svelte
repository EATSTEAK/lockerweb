<script lang='ts'>
	import FloorStatus from '../atom/FloorStatus.svelte';

	export let departmentStatus;
</script>

    <h3><span class='dept-name'>{departmentStatus.departmentName}</span> 층별 예약 현황</h3>
    <p>{departmentStatus.departmentName} 관련 문의: {departmentStatus.contact}</p>

<div class='list'>
	{#each Object.entries(departmentStatus.floors) as [key, value], index(key)}
		<FloorStatus class='my-2' floor={key} lockerLeft={value.lockerLeft}
								 totalLocker={value.totalLocker} />
	{/each}
</div>

<style>
    .dept-name {
        @apply text-primary-800;
    }

    .list {
        @apply mt-5;
    }
</style>