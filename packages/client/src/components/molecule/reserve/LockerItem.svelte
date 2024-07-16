<script lang="ts">
  export let id: string;
  export let selected: boolean = false;
  export let disabled: boolean = false;
  export let titleOverride: string = null;

  const [, , locker] = id.split('-');
  const section = locker.slice(0, 1);
  const lockerNum: number = parseInt(locker.slice(1));
  let clazz = '';
  export { clazz as class };
</script>

<button
  class:selected
  disabled={disabled ? disabled : undefined}
  on:click
  on:dblclick
  on:mousedown
  on:mousemove
  on:mouseout
  on:blur
  on:mouseover
  on:mouseup
  on:mouseenter
  on:mouseleave
  on:keypress
  on:keyup
  on:focus
  on:keydown
  tabindex="0"
  class="{clazz} flex h-16
  w-16 cursor-pointer cursor-pointer select-none flex-col items-stretch rounded-xl p-1 ring-2 ring-inset ring-gray-300 transition-all hover:scale-105 hover:brightness-95
	focus:ring focus:ring-blue-400 focus:brightness-90 active:scale-100 active:ring active:brightness-75 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
  {...$$restProps}>
  <div class="flex grow select-none items-center justify-center text-xs font-normal text-gray-400">
    {#if titleOverride}
      <p>{titleOverride}</p>
    {:else}
      <p>{section} 구역</p>
    {/if}
  </div>
  <hr class="ml-auto mr-auto mt-auto mb-auto h-px w-10 border-0 bg-gray-200" />
  <div class="select-none text-center text-2xl font-extrabold text-gray-500">{lockerNum}</div>
</button>

<style lang="postcss">
  .selected {
    @apply ring ring-blue-400;
  }

  button:disabled:hover {
    @apply scale-100;
  }
</style>
