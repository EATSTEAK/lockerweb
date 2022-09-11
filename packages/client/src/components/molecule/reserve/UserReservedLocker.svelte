<script lang='ts'>
	import Skeleton from '../../atom/Skeleton.svelte';
	import Dismiss from '../../../icons/Dismiss.svelte';
	import { extractLockerInfoFromId, getBuildingName } from '$lib/utils.js';
	import { getServiceConfig } from '$lib/api/config';
	import { createEventDispatcher } from 'svelte';
	import { config } from '$lib/store';

	const dispatch = createEventDispatcher();

	export let reservedLocker: ReservedLocker;

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

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
	<div class='relative w-full'>
		<h4 class='text-4xl'>내 정보</h4>
		<h5 class='text-xl text-blue-500 mt-3'>예약한 사물함</h5>
		<div
			class:pointer-events-none={reservedLocker === null}
			on:click={() => {
				dispatch('unclaim');
			}}
			class='hover-wrapper cursor-pointer relative w-56 h-44 rounded-2xl'
		>
			<div
				class='absolute z-10 flex flex-col justify-center text-center text-gray-500 font-bold right-0 top-0 mt-2 mr-2 rounded-lg'
			>
				<Dismiss />
			</div>
			<div
				class:invisible={reservedLocker !== null}
				class:backdrop-blur-sm={reservedLocker === null}
				class='hover-popup absolute top-0 left-0 z-30 invisible flex justify-center items-center w-full h-full drop-shadow-md font-bold text-gray-600 text-2xl rounded-xl'
			>
				{#if reservedLocker !== null}
					예약 취소
				{:else}
					<p class='text-xl'>예약된 사물함이 없음</p>
				{/if}
			</div>
			<div
				class='user-reserve-box absolute top-0 left-0 z-0 w-56 h-44 border-2 border-blue-400 rounded-2xl bg-white items-center flex flex-col p-2 gap-1'
			>
				<div
					class='flex flex-col w-full px-2 h-16 bg-gray-300 rounded-2xl text-center justify-center items-center'
				>
					<div class:invisible={reservedLocker === null} class='location text-2xl font-extrabold'>
						{getBuildingName(serviceConfig.buildings, buildingId)} {floor}층
					</div>
				</div>
				<div
					class:invisible={reservedLocker === null}
					class='number text-primary-800 grow text-7xl flex items-center font-extrabold text-center'
				>
					{section}-{lockerNum}
				</div>
			</div>
		</div>
		{#if claimedUntil}
			<div class='till ml-3 mt-1'>{claimedUntilDisplay} 까지</div>
		{/if}
	</div>
{:else}
	<div class='w-full'>
		<Skeleton class='w-52 h-10 mt-9 bg-gray-300 rounded-lg' />
		<div class='flex flex-row mt-6'>
			<Skeleton class='w-16 h-32 bg-gray-300 rounded-lg mr-2' />
			<Skeleton class='w-36 h-32 bg-gray-300 rounded-lg' />
		</div>
		<Skeleton class='w-24 h-6 mt-2 bg-gray-300 rounded-lg' />
	</div>
{/if}

<style>
    .hover-wrapper:hover > .user-reserve-box {
        @apply bg-white opacity-40 cursor-pointer transition-all;
    }

    .hover-wrapper:hover > .hover-popup {
        @apply visible backdrop-blur-sm rounded-xl;
    }
</style>
