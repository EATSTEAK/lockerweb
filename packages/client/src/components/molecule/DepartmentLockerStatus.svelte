<script lang='ts'>

	import FloorStatus from '../atom/FloorStatus.svelte';
</script>

<h3><span class='dept-name'>컴퓨터학부</span> 층별 예약 현황</h3>
<p>컴퓨터학부 관련 문의: 010-1234-5678</p>

<div class='list'>
	<FloorStatus class='my-2' floor='5F' lockerLeft={50} totalLocker={50} />
	<FloorStatus class='my-2' floor='4F' lockerLeft={20} totalLocker={50} />
	<FloorStatus class='my-2' floor='3F' lockerLeft={20} totalLocker={50} />
	<FloorStatus class='my-2' floor='2F' lockerLeft={20} totalLocker={50} />
	<FloorStatus class='my-2' floor='1F' lockerLeft={20} totalLocker={50} />
	<FloorStatus class='my-2' floor='B1' lockerLeft={20} totalLocker={50} />
</div>

<style>
    .dept-name {
        @apply text-primary-800;
    }

    .list {
        @apply mt-5;
    }
</style>

