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
	class={clazz}
	on:click
	on:click|preventDefault={() => {
		ctx.update(id);
	}}
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
        @apply bg-white box-border border-l-4 border-white transition-all p-4 outline-0 outline-none;
    }

    button:hover {
        @apply brightness-90 scale-[1.01];
    }

    button:active {
        @apply brightness-75 border-primary-800 font-bold scale-100;
    }

    button:focus {
        @apply brightness-75;
    }

    .active {
        @apply brightness-95 border-primary-800 font-bold;
    }

</style>