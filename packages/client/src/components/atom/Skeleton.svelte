<script lang="ts">

  let clazz = '';
  export { clazz as class };

  let width: number;
  let height: number;

</script>

<div class={`skeleton ${clazz}`} bind:clientWidth={width} bind:clientHeight={height} {...$$restProps}>
  <div style:--widthSize={`${width*4*1.8}px`} style:--heightSize={`${height*4*3}px`} class="skeleton-inner-animation"></div>
</div>

<style>
  .skeleton {
    @apply bg-gray-200 cursor-progress overflow-hidden;

  }
  .skeleton-inner-animation {
      @apply bg-gray-200;
      width: var(--widthSize);
      height: var(--heightSize);
      background: linear-gradient(100deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      background-size: 110% 80%;
      animation: loading 1.3s infinite;
  }
  @keyframes loading {
      from {
          background-position-x: 0;
      }
      to {
          background-position-x: -1100%;
      }
  }

</style>