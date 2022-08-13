<script lang='ts'>
	let clazz = '';
	export let style = '';
	export { clazz as class };
</script>

<div class={`tag ${clazz || ''}`} style={`${style || ''}`}>
	<slot />
</div>

<style>
    .tag {
        @apply rounded-xl py-1 px-2 font-semibold;
    }
</style>