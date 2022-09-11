<script lang='ts'>
	import { afterUpdate, getContext, onMount } from 'svelte';

	export let id: string;
	export let selected: boolean = false;
	let clazz = '';
	export { clazz as class };

	let ref = null;

	const ctx = getContext('TabGroup');

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
		bg-white text-gray-800 box-border rounded-xl transition-all p-4 outline-0 outline-none
		hover:brightness-90
		active:brightness-75 active:bg-primary-800 active:text-white active:font-bold
		focus:outline-1 focus:outline-primary-600'
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
        @apply bg-primary-800 text-white font-bold;
    }
</style>
