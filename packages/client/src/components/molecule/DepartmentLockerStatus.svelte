<script lang='ts'>
	import FloorStatus from '../atom/FloorStatus.svelte';

	export let departmentStatus;
</script>

<h3><span class='dept-name'>컴퓨터학부</span> 층별 예약 현황</h3>
<p>컴퓨터학부 관련 문의: 010-1234-5678</p>

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