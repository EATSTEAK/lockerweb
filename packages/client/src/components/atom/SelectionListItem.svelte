<script lang='ts'>
	import { afterUpdate, getContext, onMount } from 'svelte';

	export let id: string;
	export let selected: boolean = false;
	let clazz = '';
	export { clazz as class };

	let ref = null;

	const ctx = getContext('ListItemGroup');

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
	class='{clazz}
		bg-white box-border border-l-4 border-white transition-all p-4 outline-0 outline-none
		hover:brightness-90 hover:scale-101
		active:brightness-75 active:border-primary-800 active:font-bold active:scale-100
		focus:brightness-90'
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
	<slot />
</button>

<style>
    .active {
        @apply brightness-95 border-primary-800 font-bold;
    }
</style>
