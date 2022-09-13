<script lang="ts">
  let clazz = '';
  export { clazz as class };
</script>

<div class="{clazz} my-2 flex grow flex-col justify-end">
  <slot />
</div>
