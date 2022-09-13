<script>
  import ArrowUpload from '../../icons/ArrowUpload.svelte';

  let clazz = '';
  export { clazz as class };
</script>

<div class="{clazz} flex h-full flex-col items-center justify-center bg-gray-200 text-gray-400">
  <ArrowUpload class="fly-up h-16 w-16" />
  <p class="animate-pulse">업데이트 중...</p>
</div>

<style lang="postcss">
  :global(.fly-up) {
    animation-duration: 4s;
    animation-timing-function: ease-in-out;
    animation-name: fly-up;
    animation-iteration-count: infinite;
  }

  @keyframes fly-up {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    25% {
      opacity: 1;
      transform: translateY(-25%);
    }
    50% {
      opacity: 1;
      transform: translateY(-25%);
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: translateY(-400%);
    }
  }
</style>
