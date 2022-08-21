<script lang='ts'>
	export let isIconRight: boolean = false;
	let clazz;
	export { clazz as class };
</script>

<a tabindex='0' class={`${clazz || ''}`} {...$$restProps}>
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
</a>

<style>
    a {
        @apply cursor-pointer flex justify-between rounded-lg shadow-md px-4 py-3 font-bold flex-shrink-0 items-center gap-x-3 transition-all ease-in;
    }

    a[disabled] {
        @apply backdrop-brightness-75 shadow-none pointer-events-none;
    }

    a:hover {
        @apply brightness-90 shadow-lg;
    }

    a:active {
        @apply brightness-75 shadow-md;
    }

    :global(.btn-icon path:not([fill="none"])) {
        fill: currentColor;
    }
</style>