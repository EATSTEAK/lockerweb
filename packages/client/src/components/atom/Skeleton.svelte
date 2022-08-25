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
    @apply cursor-progress overflow-hidden;

  }
  .skeleton-inner-animation {
      width: var(--widthSize);
      height: var(--heightSize);
      background: linear-gradient(100deg, rgba(0, 0, 0, 0.01) 12%, rgba(255, 255, 255, 0.3) 18%, rgba(0, 0, 0, 0.01) 22%);
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