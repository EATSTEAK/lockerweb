<script>
  import ArrowClockwise from '../../icons/ArrowClockwise.svelte';

  let clazz = '';
  export { clazz as class };
</script>

<div class="{clazz} flex h-full flex-col items-center justify-center bg-gray-200 text-gray-400">
  <ArrowClockwise class="h-16 w-16 animate-spin" />
  <p>불러오는 중...</p>
</div>
