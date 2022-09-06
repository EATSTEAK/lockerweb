<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import LockerItem from './LockerItem.svelte';

	export let selectedId;
	export let lockers: { lockerId: string, disabled: boolean, reserved: boolean }[] = [];
	export let height: number = 5;
	$: widthScale = (5 * (lockers.length / height)) + 1;
	$: heightScale = 5 * height;


	const dispatch = createEventDispatcher();
	$: if (selectedId) {
		dispatch('change', selectedId);
	}


</script>

<div class='flex flex-col flex-wrap mt-2 ml-auto mr-auto' style={`width:${widthScale}rem; height:${heightScale}rem;`}>
	{#each lockers as { lockerId, disabled, reserved }, index}
		<LockerItem class='ml-4 my-2' id={lockerId} disabled={disabled || reserved} on:click={() => selectedId = lockerId}
								selected={selectedId === lockerId}
								titleOverride={reserved ? '예약됨' : disabled ? '예약 불가' : undefined} />
	{/each}
</div>
