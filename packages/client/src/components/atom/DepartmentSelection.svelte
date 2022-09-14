<script lang="ts">
  import { afterUpdate, getContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let id: string;
  export let selected: boolean = false;
  export let departmentText: string;
  export let lockerLeft: number;
  export let totalLocker: number;
  export let activateFrom: Date;
  export let activateTo: Date;

  $: activateTime = activateFrom || activateTo ? timeCalc(activateFrom, activateTo) : '';

  let ref = null;

  const ctx = getContext<{
    currentId: Writable<string>;
    add: ({ id: string, selected: boolean }) => void;
    update: (id: string) => void;
    change: (direction: number) => void;
  }>('DepartmentSelectionGroup');

  ctx.add({ id, selected });

  const unsubscribe = ctx.currentId.subscribe(($: string) => {
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

  function timeCalc(activateFrom: Date, activateTo: Date): string {
    const fromDate = activateFrom ? `${activateFrom.getMonth() + 1}/${activateFrom.getDate()}` : '';
    const toDate = activateTo ? `${activateTo.getMonth() + 1}/${activateTo.getDate()}` : '';
    const fromMinutes = activateFrom ? `${activateFrom.getMinutes()}`.padStart(2, '0') : '';
    const fromTime = activateFrom ? `${activateFrom.getHours()}:${fromMinutes}` : '';
    const toMinutes = activateTo ? `${activateTo.getMinutes()}`.padStart(2, '0') : '';
    const toTime = activateTo ? `${activateTo.getHours()}:${toMinutes}` : '';
    const isToDateDifferent = toDate && toDate !== fromDate;
    return `${fromDate} ${fromTime} ~ ${isToDateDifferent ? `${toDate} ` : ''}${toTime}`;
  }
</script>

<button
  bind:this={ref}
  class={`${lockerLeft <= 0 ? 'unavailable' : ''} ${selected ? 'active' : ''}
	box-border aspect-square
	max-w-[160px] flex-shrink-0 flex-grow-0 basis-[160px]
	rounded-2xl bg-gray-100 transition-all
	hover:brightness-95
	focus:brightness-90
	active:brightness-75`}
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
  }}>
  <div class="flex flex-col">
    <div class="department-text">{departmentText}</div>
    <div class="flex flex-col flex-wrap items-stretch font-bold">
      <div class="locker-left -mb-2 grow text-center text-6xl text-primary-800">{lockerLeft}</div>
      <div class="mx-5 text-right text-xl">/{totalLocker}</div>
    </div>
    <div class="available-time text-sm">{activateTime}</div>
  </div>
</button>

<style lang="postcss">
  button {
    box-shadow: inset 0 0 0 2px theme('colors.gray.300');
  }

  .unavailable .locker-left {
    @apply text-red-600;
  }

  .unavailable.active {
    @apply ring-4 ring-inset ring-red-600;
  }

  .unavailable.active:hover {
    @apply shadow-md ring-4 ring-inset ring-red-600;
  }

  .active {
    @apply border-primary-800 ring-4 ring-inset ring-primary-800;
  }

  .active:hover {
    @apply shadow-md ring-4 ring-inset ring-primary-800;
  }
</style>
