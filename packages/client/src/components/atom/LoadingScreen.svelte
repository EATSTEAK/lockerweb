<script>
	import ArrowClockwise from '../../icons/ArrowClockwise.svelte';

	let clazz;
	export { clazz as class };
</script>

<div class={clazz}>
	<ArrowClockwise class='animate-spin w-16 h-16' />
	<p>불러오는 중...</p>
</div>

<style>
    div {
        @apply h-full bg-gray-200 text-gray-400 flex flex-col justify-center items-center;
    }
</style>