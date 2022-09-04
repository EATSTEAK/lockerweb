<script lang='ts'>
	export let isIconRight: boolean = false;
	let clazz = '';
	export { clazz as class };
	export let href = null;
</script>


<!--suppress RequiredAttributes -->
<svelte:element this='{href ? "a" : "button"}' on:click
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
								tabindex='0'
								class='{clazz} cursor-pointer select-none
	 flex justify-between items-center px-4 py-3 flex-shrink-0 gap-x-3
	 rounded-xl shadow-md font-bold transition-all ease-in
	 [&[disabled]]:opacity-50 [&[disabled]]:shadow-none [&[disabled]]:pointer-events-none
	 hover:brightness-90 hover:shadow-lg
	 active:brightness-75 active:shadow-md'
								{...$$restProps}>
	{#if !isIconRight}
		{#if $$slots.icon}
			<div class='btn-icon'>
				<slot name='icon' />
			</div>
		{/if}
		<slot />
	{:else}
		<slot />
		{#if $$slots.icon}
			<div class='btn-icon'>
				<slot name='icon' />
			</div>
		{/if}
	{/if}
</svelte:element>

<style>
    :global(.btn-icon path:not([fill="none"])) {
        fill: currentColor;
    }
</style>