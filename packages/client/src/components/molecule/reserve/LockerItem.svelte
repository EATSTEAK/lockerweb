<script lang='ts'>
	export let id: string;
	export let selected: boolean = false;
	export let disabled: boolean = false;
	export let titleOverride: string = null;

	const [buildingId, floor, locker] = id.split('-');
	let section = locker.slice(0, 1);
	let lockerNum: number = parseInt(locker.slice(1));
	let claimedUntil: Date;
	let clazz = '';
	export { clazz as class };
</script>

<button
	class:selected
	disabled={disabled ? disabled : undefined}
	on:click
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
	tabindex='0'
	class='{clazz} cursor-pointer select-none
  flex flex-col items-stretch w-16 h-16 ring-2 ring-gray-300 ring-inset rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-100
	focus:ring focus:ring-blue-400 active:ring p-1 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:pointer-events-none'
	{...$$restProps}
>
	<div class='grow flex font-normal text-xs text-gray-400 justify-center items-center select-none'>
		{#if titleOverride}
			<p>{titleOverride}</p>
		{:else}
			<p>{section} 구역</p>
		{/if}
	</div>
	<hr class='w-10 h-px border-0 bg-gray-200 ml-auto mr-auto mt-auto mb-auto' />
	<div class='text-2xl font-extrabold text-gray-500 text-center select-none'>{lockerNum}</div>
</button>

<style>
    .selected {
        @apply ring ring-blue-400;
    }

    button:disabled:hover {
        @apply scale-100;
    }
</style>
