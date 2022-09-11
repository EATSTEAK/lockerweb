<script lang='ts'>
	export let message: string = '사물함 불러오는 중...';
	export let selectedLockerInfo: string = null;
	let clazz = '';
	export { clazz as class };
	import Locker from '../../icons/Locker.svelte';
</script>

<div class='{clazz} h-full bg-gray-100 text-gray-400 flex flex-col justify-center items-center'>
	<Locker class='rotate-stop w-16 h-16 mb-2' />
	<p>{message}</p>
	{#if selectedLockerInfo}
		<p class='bg-gray-200 rounded-lg py-1 px-2 mt-1'>{selectedLockerInfo}</p>
	{/if}
</div>

<style>
    :global(.rotate-stop) {
        animation-duration: 4s;
        animation-name: rotate-stop;
        animation-iteration-count: infinite;
    }

    @keyframes rotate-stop {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(90deg);
        }
        50% {
            transform: rotate(90deg);
        }
        75% {
            transform: rotate(-180deg);
        }
        100% {
            transform: rotate(-180deg);
        }
    }
</style>
