<script>
	import ErrorCircle from '../../icons/ErrorCircle.svelte';

	export let errorMessage = '오류가 발생하였습니다. 관리자에게 문의하십시오.';
	let clazz = '';
	export { clazz as class };
</script>

<div class={clazz}>
	<ErrorCircle class='w-16 h-16' />
	<h4>오류!</h4>
	<p>{errorMessage}</p>
</div>

<style>
    div {
        @apply h-full bg-red-200 text-gray-700 flex flex-col justify-center items-center;
    }
</style>