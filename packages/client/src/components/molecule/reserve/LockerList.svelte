<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import LockerItem from './LockerItem.svelte';

	export let selectedId;
	export let lockers: [string, boolean][] = [];
	export let height: number = 5;
	$: widthScale = (5 * (lockers.length / height)) + 1;
	$: heightScale = 5 * height;


	const dispatch = createEventDispatcher();
	$: if (selectedId) {
		dispatch('change', selectedId);
	}


</script>

<div class='flex flex-col flex-wrap mt-2 ml-auto mr-auto' style={`width:${widthScale}rem; height:${heightScale}rem;`}>
	{#each lockers as [lockerId, disabled], index}
		<LockerItem class='ml-4 my-2' id={lockerId} {disabled} on:click={() => selectedId = lockerId}
								selected={selectedId === lockerId} />
	{/each}
</div>
