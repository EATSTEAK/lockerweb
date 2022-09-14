<script lang="ts">
  export let isIconRight: boolean = false;
  let clazz = '';
  export { clazz as class };
  export let href = null;
</script>

<!--suppress RequiredAttributes -->
<svelte:element
  this={href ? 'a' : 'button'}
  on:click
  on:dblclick
  on:mousedown
  on:mousemove
  on:blur
  on:mouseout
  on:focus
  on:mouseover
  on:mouseup
  on:mouseenter
  on:mouseleave
  on:keydown
  on:keypress
  on:keyup
  {href}
  tabindex="0"
  class="{clazz} flex flex-shrink-0
	 cursor-pointer select-none items-center justify-between gap-x-3 rounded-xl px-4
	 py-3 font-bold shadow-md transition-all ease-in
	 hover:shadow-lg hover:brightness-95 focus:brightness-90
	 active:shadow-md active:brightness-75
	 [&[disabled]]:pointer-events-none
	 [&[disabled]]:opacity-50 [&[disabled]]:shadow-none"
  {...$$restProps}>
  {#if !isIconRight}
    {#if $$slots.icon}
      <div class="btn-icon">
        <slot name="icon" />
      </div>
    {/if}
    <slot />
  {:else}
    <slot />
    {#if $$slots.icon}
      <div class="btn-icon">
        <slot name="icon" />
      </div>
    {/if}
  {/if}
</svelte:element>

<style lang="postcss">
  :global(.btn-icon path:not([fill='none'])) {
    fill: currentColor;
  }
</style>
