<script>
	let clazz = '';
	export { clazz as class };
	import SelectObject from '../../icons/SelectObject.svelte';
</script>

<div class={clazz}>
	<SelectObject class='rotate-stop w-16 h-16' />
	<p>대상을 선택하세요...</p>
</div>

<style>
    div {
        @apply h-full bg-gray-200 text-gray-400 flex flex-col justify-center items-center;
    }

    :global(.rotate-stop) {
        animation-duration: 4s;
        animation-name: rotate-stop;
        animation-iteration-count: infinite;
    }

    @keyframes rotate-stop {
        0% {
            transform: rotate(0deg)
        }
        25% {
            transform: rotate(90deg)
        }
        50% {
            transform: rotate(90deg)
        }
        75% {
            transform: rotate(-180deg)
        }
        100% {
            transform: rotate(-180deg)
        }
    }
</style>