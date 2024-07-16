<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import ChevronDown from '../../icons/ChevronDown.svelte';

  let clazz = '';
  export { clazz as class };

  const { collapsed, set } = getContext<{
    collapsed: Writable<boolean>;
    set: (isCollapsed: boolean) => void;
  }>('Sidebar');
</script>

<button
  class="{clazz} rounded-md p-1 hover:brightness-95 hover:backdrop-brightness-95 focus:brightness-90 focus:backdrop-brightness-90 active:brightness-75 active:backdrop-brightness-75"
  on:click={() => set(!$collapsed)}>
  <ChevronDown class="transition-all{$collapsed ? ' rotate-180' : ''}" />
</button>

<style lang="postcss">
</style>
