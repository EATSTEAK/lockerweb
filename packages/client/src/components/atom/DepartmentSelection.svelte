<script lang='ts'>
	import { afterUpdate, getContext, onMount } from 'svelte';

	export let id: string;
	export let selected: boolean;
	export let departmentText: string;
	export let lockerLeft: number;
	export let totalLocker: number;
	export let availableTime: string;

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
</script>

<button
	bind:this={ref}
	class={`${lockerLeft >= totalLocker ? 'unavailable' : ''} ${selected ? "active" : ''}`}
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
	<div class='wrap'>
		<div class='department-text'>{departmentText}</div>
		<div class='locker-status'>
			<span class='left-locker'>{lockerLeft}</span><span class='all-locker'>/{totalLocker}</span>
		</div>
		<div class='availableTime'>{availableTime}</div>
	</div>

</button>

<style>
    button {
        @apply aspect-square rounded-2xl m-1 bg-gray-100 box-border transition-all;
        box-shadow: inset 0 0 0 2px theme('colors.gray.300');
    }

    button:hover {
        @apply brightness-90;
    }

    .wrap {
        @apply flex flex-col px-5;
    }

    .wrap > div {
        @apply my-1;
    }

    .locker-status {
        @apply font-bold;
    }

    .unavailable .left-locker {
        @apply text-red-600;
    }

    .left-locker {
        @apply text-primary-800 text-6xl;
    }

    .all-locker {
        @apply text-2xl;
    }

    .unavailable.active {
        @apply border-rose-600;
        box-shadow: inset 0 0 0 4px theme('colors.red.600');
    }

    .unavailable.active:hover {
        @apply shadow-md;
        box-shadow: inset 0 0 0 4px theme('colors.red.600');
    }

    .active {
        @apply border-primary-800;
        box-shadow: inset 0 0 0 4px theme('colors.primary.800');
    }

    .active:hover {
        @apply shadow-md;
        box-shadow: inset 0 0 0 4px theme('colors.primary.800');
    }

</style>