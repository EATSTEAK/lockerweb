<script>
  import ErrorCircle from '../../icons/ErrorCircle.svelte';

  export let errorMessage = '오류가 발생하였습니다. 관리자에게 문의하십시오.';
  export let errorTitle = '오류!';
  let clazz = '';
  export { clazz as class };
</script>

<div class="{clazz} flex h-full flex-col items-center justify-center bg-red-200 text-gray-700">
  <div class="flex flex-col items-start gap-1">
    <div class="flex flex-row items-center gap-2">
      <ErrorCircle class="h-16 w-16" />
      <h1>{errorTitle}</h1>
    </div>
    <p>{errorMessage}</p>
  </div>
</div>

<style lang="postcss">
</style>
