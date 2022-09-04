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
	class={clazz}
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
    button {
        @apply bg-white text-gray-800 box-border rounded-xl transition-all p-4 outline-0 outline-none;
    }

    button:hover {
        @apply brightness-90;
    }

    button:active {
        @apply brightness-75 bg-primary-800 text-white font-bold;
    }

    button:focus {
        @apply outline-1 outline-primary-600;
    }

    .active {
        @apply bg-primary-800 text-white font-bold;
    }

</style>