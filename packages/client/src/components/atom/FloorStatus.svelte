<script lang='ts'>
	import { config } from '$lib/store';
	import { getServiceConfig } from '$lib/api/config';

	export let building: string;
	export let floor: string;
	export let lockerLeft: number;
	export let totalLocker: number;
	let clazz = '';
	export { clazz as class };
	$: buildingDisplay =
		$config &&
		$config.success &&
		(getServiceConfig($config.result).buildings[building]?.name ?? '알 수 없음');
	$: floorDisplay = !(floor ?? '').startsWith('B') ? `${floor}F` : floor;
	$: percentage = totalLocker
		? Math.round(((totalLocker - (lockerLeft ?? 0)) / totalLocker) * 100)
		: 0;
</script>

<div
	class={`${clazz || ''} ${
		lockerLeft <= 0 ? 'disabled' : ''
	} relative border-2 rounded-2xl overflow-hidden`}
>
	<div
		class='progress absolute top-0 left-0 bg-gray-100 rounded-2xl h-full'
		style='width: {percentage}%'
	/>
	<div class='absolute top-0 left-0 flex justify-between items-center px-3 w-full h-full'>
		<div
			class='flex justify-end items-center px-3 font-bold text-gray-400'
			style='width: {percentage}%'
		>
			<span class='hidden lg:inline'>
				{#if percentage >= 20}
					{percentage}%
				{/if}
			</span>
		</div>
		<div class='font-bold'>
			<span class='locker-left text-primary-800 text-4xl'>{lockerLeft}</span><span class='text-xl'
		>/{totalLocker}</span
		>
		</div>
	</div>
	<div
		class='absolute top-0 left-0 flex flex-row relative items-center justify-between gap-5 px-4 py-1.5'
	>
		<div class='flex flex-col'>
			<p class='text-sm text-gray-500'>{buildingDisplay}</p>
			<div class='flex text-3xl font-bold gap-5'>
				<div>{floorDisplay} |</div>
				<div>
					<span class='hidden sm:inline'>
						{#if lockerLeft > 0}
							예약 가능
						{:else}
							예약 불가
						{/if}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .disabled {
        @apply border-gray-300 text-gray-400 bg-gray-300;
    }

    .disabled .progress {
        @apply bg-gray-300;
    }

    .disabled .locker-left {
        @apply text-red-600;
    }
</style>
