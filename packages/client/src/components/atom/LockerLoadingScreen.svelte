<script lang="ts">
  export let message: string = '사물함 불러오는 중...';
  export let selectedLockerInfo: string = null;
  let clazz = '';
  export { clazz as class };
  import Locker from '../../icons/Locker.svelte';
</script>

<div class="{clazz} flex h-full flex-col items-center justify-center bg-gray-100 text-gray-400">
  <Locker class="rotate-stop mb-2 h-16 w-16" />
  <p>{message}</p>
  {#if selectedLockerInfo}
    <p class="mt-1 rounded-lg bg-gray-200 py-1 px-2">{selectedLockerInfo}</p>
  {/if}
</div>

<style lang="postcss">
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
