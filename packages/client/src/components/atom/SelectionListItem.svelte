<script lang="ts">
  import { afterUpdate, getContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let id: string;
  export let selected: boolean = false;
  let clazz = '';
  export { clazz as class };

  let ref = null;

  const ctx = getContext<{
    currentId: Writable<string>;
    add: ({ id: string, selected: boolean }) => void;
    update: (id: string) => void;
    change: (direction: number) => void;
  }>('ListItemGroup');

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
</script>

<button
  bind:this={ref}
  class:active={selected}
  class="{clazz}
		box-border border-l-4 border-white bg-white p-4 outline-none outline-0 transition-all
		hover:scale-101 hover:brightness-90
		focus:brightness-90 active:scale-100 active:border-primary-800 active:font-bold
		active:brightness-75"
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
  <slot />
</button>

<style lang="postcss">
  .active {
    @apply border-primary-800 font-bold brightness-95;
  }
</style>
