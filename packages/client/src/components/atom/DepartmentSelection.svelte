<script lang='ts'>
	import { afterUpdate, getContext, onMount } from 'svelte';

	export let id: string;
	export let selected: boolean;
	export let departmentText: string;
	export let lockerLeft: number;
	export let totalLocker: number;
	export let activateFrom: Date;
	export let activateTo: Date;

	$: activateTime = activateFrom || activateTo ? timeCalc(activateFrom, activateTo) : '';

	let ref = null;

	const ctx = getContext('DepartmentSelectionGroup');

	ctx.add({ id, selected });

	const unsubscribe = ctx.currentId.subscribe(($) => {
		selected = $ === id;
	});

	afterUpdate(() => {
		if (selected) {
			ref.focus();
		}
	});

	onMount(() => {
		return () => unsubscribe();
	});

	function timeCalc(activateFrom: Date, activateTo: Date): string {
		const fromDate = activateFrom ? `${activateFrom.getMonth() + 1}/${activateFrom.getDate()}` : '';
		const toDate = activateTo ? `${activateTo.getMonth() + 1}/${activateTo.getDate()}` : '';
		const fromMinutes = activateFrom ? `${activateFrom.getMinutes()}`.padStart(2, '0') : '';
		const fromTime = activateFrom ? `${activateFrom.getHours()}:${fromMinutes}` : '';
		const toMinutes = activateTo ? `${activateTo.getMinutes()}`.padStart(2, '0') : '';
		const toTime = activateTo ? `${activateTo.getHours()}:${toMinutes}` : '';
		const isToDateDifferent = toDate && toDate !== fromDate;
		return `${fromDate} ${fromTime} ~ ${isToDateDifferent ? `${toDate} ` : ''}${toTime}`;
	}
</script>

<button
	bind:this={ref}
	class={`${lockerLeft <= 0 ? 'unavailable' : ''} ${selected ? 'active' : ''}
	aspect-square max-w-[160px]
	rounded-2xl bg-gray-100 box-border transition-all
	flex-grow-0 flex-shrink-0 basis-[160px]
	hover:brightness-90`}
	on:click
	on:click|preventDefault={() => {
		ctx.update(id);
	}}
	on:focus
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:keydown
	on:keydown={({ key }) => {
		if (key === 'ArrowRight') {
			ctx.change(1);
		} else if (key === 'ArrowLeft') {
			ctx.change(-1);
		}
	}}
>
	<div class='flex flex-col'>
		<div class='department-text'>{departmentText}</div>
		<div class='font-bold flex flex-col items-stretch flex-wrap'>
			<div class='locker-left text-primary-800 text-6xl grow text-center -mb-2'>{lockerLeft}</div>
			<div class='text-xl text-right mx-5'>/{totalLocker}</div>
		</div>
		<div class='available-time text-sm'>{activateTime}</div>
	</div>
</button>

<style>
    button {
        box-shadow: inset 0 0 0 2px theme('colors.gray.300');
    }

    .unavailable .locker-left {
        @apply text-red-600;
    }

    .unavailable.active {
        @apply ring-4 ring-inset ring-red-600;
    }

    .unavailable.active:hover {
        @apply shadow-md ring-4 ring-inset ring-red-600;
    }

    .active {
        @apply border-primary-800 ring-4 ring-inset ring-primary-800;
    }

    .active:hover {
        @apply shadow-md ring-4 ring-inset ring-primary-800;
    }
</style>
