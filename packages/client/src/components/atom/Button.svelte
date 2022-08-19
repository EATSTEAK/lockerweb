<script lang='ts'>
	export let isIconRight: boolean = false;
	let clazz;
	export { clazz as class };
</script>

<a class={`${clazz || ''}`} {...$$restProps}>
	{#if !isIconRight}
		<div class='btn-icon'>
			<slot name='icon' />
		</div>
		<slot />
	{:else}
		<slot />
		<div class='btn-icon'>
			<slot name='icon' />
		</div>
	{/if}
</a>

<style>
    a {
        @apply flex justify-between rounded-lg shadow-md px-4 py-3 font-bold flex-shrink-0 items-center gap-x-3 m-1 transition-all ease-in;
    }

    a[disabled] {
        @apply backdrop-brightness-75 shadow-none pointer-events-none;
    }

    a:hover {
        @apply brightness-90 drop-shadow-lg;
    }

    .btn-icon {

    }

    :global(.btn-icon path:not([fill="none"])) {
        fill: currentColor;
    }
</style>