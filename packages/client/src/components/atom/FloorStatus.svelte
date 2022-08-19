<script lang='ts'>
	export let floor: string;
	export let lockerLeft: number;
	export let totalLocker: number;
	let clazz = '';
	export { clazz as class };
	$: percentage = totalLocker ? Math.round(((totalLocker - (lockerLeft ?? 0)) / totalLocker) * 100) : 0;
</script>

<div class={`progress-wrap ${clazz || ''} ${lockerLeft <= 0 ? 'disabled' : ''}`}>
	<div class='progress' style='width: {percentage}%'></div>
	<div class='progress-text'>
		<div class='percentage-text-wrap' style='width: {percentage}%'>
			<span class='hidden md:inline'>
				{#if percentage >= 20}
				{percentage}%
			{/if}
			</span>

		</div>
		<div class='locker-status'>
			<span class='left-locker'>{lockerLeft}</span><span class='all-locker'>/{totalLocker}</span>
		</div>
	</div>
	<div class='wrap'>
		<div class='content'>
			<div class='floor'>{floor} |</div>
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


<style>

		.disabled {
			@apply border-gray-300 text-gray-400 bg-gray-300;
		}

		.disabled .progress {
				@apply bg-gray-300;
		}

		.disabled .left-locker {
				@apply text-red-600;
		}

    .progress-wrap {
        @apply relative border-2 rounded-2xl overflow-hidden;
    }

    .progress {
        @apply absolute top-0 left-0 bg-gray-100 rounded-2xl h-full;
    }

    .progress-text {
        @apply absolute top-0 left-0 flex justify-between items-center px-3 w-full h-full;
    }

    .percentage-text-wrap {
        @apply flex justify-end items-center px-3 font-bold text-gray-400;
    }

    .wrap {
        @apply absolute top-0 left-0 flex flex-row relative items-center justify-between gap-5 px-4 py-1.5;
    }

    .content {
        @apply flex text-3xl font-bold gap-5;
    }

    /*.floor {*/
    /*    @apply text-lg;*/
    /*}*/

    .locker-status {
        @apply font-bold;
    }

    .left-locker {
        @apply text-primary-800 text-4xl;
    }

    .all-locker {
        @apply text-xl;
    }
</style>