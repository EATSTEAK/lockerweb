<script lang='ts'>
	import Skeleton from '../../atom/Skeleton.svelte';

	export let reservedLocker: ReservedLocker;

	let buildingId: string;
	let floor: string;
	let section: string;
	let lockerNum: number;
	let claimedUntil: Date;
	$: if (reservedLocker) {
		const [building_, floor_, locker] = reservedLocker.lockerId.split('-');
		buildingId = building_;
		floor = floor_;
		section = locker.slice(0, 1);
		lockerNum = parseInt(locker.slice(1));
		if (reservedLocker.claimedUntil) claimedUntil = reservedLocker.claimedUntil as Date;
	}
	const dateFormatter = new Intl.DateTimeFormat('ko', { timeStyle: 'short', dateStyle: 'short' });
	$: claimedUntilDisplay = claimedUntil ? dateFormatter.format(claimedUntil) : '';
</script>
{#if reservedLocker !== undefined}
	<div class='user-reserve-locker-container w-full'>
		<h4 class='text-4xl'>내 정보</h4>
		<h5 class='text-xl text-blue-500 mt-3'>예약한 사물함</h5>
		<div class='w-56 h-44 border-2 border-blue-400 rounded-2xl bg-white items-center flex p-2 gap-1'>
			<div class='flex flex-col w-2/5 h-40 bg-gray-300 rounded-2xl text-center justify-center items-center'>
				<div class='text-2xl font-extrabold align-middle'>구역</div>
				<div class='location text-7xl font-extrabold'>{section}</div>
			</div>
			<div class='number text-primary-800 grow text-7xl font-extrabold text-center'>{lockerNum}</div>
		</div>
		{#if claimedUntil}
			<div class='till ml-3 mt-1'>{claimedUntilDisplay} 까지</div>
		{/if}
	</div>
{:else}
	<div class='w-full'>
		<Skeleton class='w-52 h-10 mt-9 bg-gray-300 rounded-lg'></Skeleton>
		<div class='flex flex-row mt-6'>
			<Skeleton class='w-16 h-32 bg-gray-300 rounded-lg mr-2'></Skeleton>
			<Skeleton class='w-36 h-32 bg-gray-300 rounded-lg'></Skeleton>
		</div>
		<Skeleton class='w-24 h-6 mt-2 bg-gray-300 rounded-lg'></Skeleton>
	</div>
{/if}

<style>
    .hover-wrapper:hover > .user-reserve-box {
        @apply bg-white opacity-40 cursor-pointer transition-all;
    }

    .hover-wrapper:hover > .hover-popup {
        @apply visible backdrop-blur-sm rounded-xl;
    }

    .user-reserve-locker-container {
        @apply relative;
    }
</style>