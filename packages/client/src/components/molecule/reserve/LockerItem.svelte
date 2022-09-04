<script lang='ts'>
	import { afterUpdate, getContext, onMount } from 'svelte';

	export let id: string;
	export let selected: boolean = false;

	const [buildingId, floor, locker] = id.split('-');
	let section = locker.slice(0, 1);
	let lockerNum: number = parseInt(locker.slice(1));
	let claimedUntil: Date;
	let clazz = '';
	export { clazz as class };

	let ref = null;
	const ctx = getContext('LockerGroup');
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
</script>

<button
	bind:this={ref}
	class:active={selected}
	on:click
	on:click|preventDefault={() => {
		ctx.update(id);
	}}
	on:dblclick
	on:mousedown
	on:mousemove
	on:mouseout
	on:mouseover
	on:mouseup
	on:mouseenter
	on:mouseleave
	on:keypress
	on:keyup
	on:focus
	on:keydown
	on:keydown={({ key }) => {
    if (key === 'ArrowRight') {
      ctx.change(1);
    } else if (key === 'ArrowLeft') {
      ctx.change(-1);
    }
  }}
	tabindex='0'
	class='{clazz} cursor-pointer select-none
  flex flex-col w-16 h-16 flex ml-4 mb-2 mt-2 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-100
	focus:border-[3px] focus:border-blue-400 active:border-[3px]'
	{...$$restProps}>
	<div class='location-title'>
		<p>{section}</p>
		<p class='pl-0.5'>구역</p>
	</div>
	<div class='divide-line'></div>
	<div class='locker-number'>{lockerNum}</div>
</button>

<style>
    .selected {
        @apply border-[3px] border-blue-400;
    }

    .selected > div {
        @apply text-blue-400;
    }

    .selected > .divide-line {
        @apply bg-blue-300;
    }

    .disabled {
        @apply opacity-60 bg-gray-100 transition-all;
    }

    .disabled:hover {
        @apply scale-100;
    }


    .location-title {
        @apply flex mr-auto ml-auto font-normal text-xs text-gray-400 mt-1 mx-1 text-center mb-auto select-none;
    }

    .divide-line {
        @apply w-10 h-px bg-gray-200 ml-auto mr-auto mt-auto mb-auto;
    }

    .locker-number {
        @apply text-2xl font-extrabold text-gray-500 text-center mr-auto ml-auto pb-0.5 select-none;
    }
</style>