<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LockerItem from './LockerItem.svelte';

	export let selectedId: string;
	export let lockers: { lockerId: string; disabled: boolean; reserved: boolean }[] = [];
	export let height: number;

  const dispatch = createEventDispatcher();
  $: if (selectedId) {
    dispatch('change', selectedId);
  }
</script>

<div
	class='grid grid-flow-col gap-4 mb-16 mx-auto p-4'
	style={`grid-template-rows: repeat(${height ?? 5}, minmax(0, 1fr));`}
>
	{#each lockers as { lockerId, disabled, reserved }}
		<LockerItem
			class='my-2'
			id={lockerId}
			disabled={disabled || reserved}
			on:click={() => (selectedId = lockerId)}
			selected={selectedId === lockerId}
			titleOverride={reserved ? '예약됨' : disabled ? '예약 불가' : undefined}
		/>
	{/each}
</div>
