<script lang="ts">
  export let message: string = "사물함 불러오는 중...";
  let clazz;
  export { clazz as class };
  import Locker from "../../icons/Locker.svelte";
</script>

<div class={clazz}>
  <Locker class="rotate-stop w-16 h-16 mb-2" />
  <p>{message}</p>
</div>

<style>
    div {
        @apply h-full bg-gray-100 text-gray-400 flex flex-col justify-center items-center;
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