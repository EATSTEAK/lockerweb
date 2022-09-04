<script>
	import ErrorCircle from '../../icons/ErrorCircle.svelte';

	export let errorMessage = '오류가 발생하였습니다. 관리자에게 문의하십시오.';
	export let errorTitle = '오류!';
	let clazz = '';
	export { clazz as class };
</script>

<div class='{clazz} h-full bg-red-200 text-gray-700 flex flex-col justify-center items-center'>
	<div class='flex flex-col gap-1 items-start'>
		<div class='flex flex-row gap-2 items-center'>
			<ErrorCircle class='w-16 h-16' />
			<h1>{errorTitle}</h1>
		</div>
		<p>{errorMessage}</p>
	</div>
</div>

<style>
</style>