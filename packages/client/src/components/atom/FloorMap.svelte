<script lang="ts">
  import { getBuildingName } from '$lib/utils';
  import { config } from '$lib/store';
  import { getServiceConfig } from '$lib/api/config';
  import { fade, fly } from 'svelte/transition';
  import { Image, Layer, Stage, type KonvaWheelEvent, type KonvaDragTransformEvent } from 'svelte-konva';
  import type { Stage as StageHandle } from 'konva/lib/Stage';
  import { onMount } from 'svelte';
  import Skeleton from './Skeleton.svelte';
  import Button from './Button.svelte';
  import ArrowClockwise from '../../icons/ArrowClockwise.svelte';

  export let selectedBuildingId: string;
  export let selectedFloor: string;
  export let selectedSectionId: string;

  function resolveFloorMapSrc(buildingId, floor) {
    return `/floorMaps/${buildingId}/${floor}.png`;
  }

  let clazz = '';
  export { clazz as class };
  
  let alt = '배치도';

  let parent: HTMLDivElement;
  let stage: StageHandle;
  let image: HTMLImageElement;
  let width: number;
  let height: number;
  let resizeCallback: NodeJS.Timeout;
  let imageRatio: number;
  let zoomScale = 1;
  let stageX = 0;
  let stageY = 0;
  let defaultScale: number;

  $: canvasRatio = width && height && width / height;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function resizeCanvas(_entries: ResizeObserverEntry[], _observer: ResizeObserver) {
    if(resizeCallback) clearTimeout(resizeCallback);
    if(width !== parent.clientWidth || height !== parent.clientHeight) {
      width = undefined;
      height = undefined;
      resizeCallback = setTimeout(function() {
        if(parent) {
          width = parent?.clientWidth;
          height = parent?.clientHeight;
          console.log(`resized: ${width}, ${height}`);
        }
        resizeCallback = undefined;
      }, 500);
    }
  }

  onMount(() => {
    width = parent?.clientWidth;
    height = parent?.clientHeight;
    new ResizeObserver(resizeCanvas).observe(parent);
  });

  $: if ($config.success && selectedBuildingId) {
    const serviceConfig = getServiceConfig($config?.result);
    alt = `${getBuildingName(
      serviceConfig.buildings,
      selectedBuildingId,
    )} ${selectedFloor}층 배치도`;
    const img = document.createElement("img");
    img.src = resolveFloorMapSrc(selectedBuildingId, selectedFloor);
    img.onload = () => {
        image = img;
        imageRatio = img.width / img.height;
    };
  }

  $: if(imageRatio && canvasRatio) {
    defaultScale = canvasRatio >= imageRatio ? height / image.height : width / image.width;
    zoomScale = defaultScale;
  }

  function zoomMap(e: KonvaWheelEvent): void {
    e.detail.evt.preventDefault();
    let oldScale = zoomScale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.detail.evt.deltaY > 0 ? -1 : 1;

    if (e.detail.evt.ctrlKey) {
      direction = -direction;
    }

    zoomScale = direction > 0 ? oldScale * 1.2 : oldScale / 1.2;

    stageX = pointer.x - mousePointTo.x * zoomScale;
    stageY = pointer.y - mousePointTo.y * zoomScale;
  }

  function reset() {
    stageX = 0;
    stageY = 0;
    zoomScale = defaultScale;
  }

  function updateStageCoord(e: KonvaDragTransformEvent): void {
      stageX = e.detail.target.x();
      stageY = e.detail.target.y();
  }
</script>

{#key `${selectedBuildingId}-${selectedFloor}`}
  <div
    bind:this={parent}
    class="{clazz} relative h-full w-full"
    in:fly={{ y: 100, duration: 300 }}
    aria-label={alt}>
    {#if !isNaN(width) && !isNaN(height)}
      {#key `${width};${height}`}
        <Stage
          bind:handle={stage}
          config={{ width, height, scale: { x: zoomScale, y: zoomScale }, x: stageX, y: stageY, draggable: true }}
          on:wheel={zoomMap}
          on:dragend={updateStageCoord}
        >
          <Layer>
            <Image config={{ x: 0, y: 0, image }}></Image>
          </Layer>
        </Stage>
      {/key}
      {#if stageX !== 0 || stageY !== 0 || zoomScale !== defaultScale}
        <Button class="absolute bottom-0 right-0 m-4 bg-white" on:click={reset}><ArrowClockwise /></Button>
      {/if}
      {#if selectedSectionId}
        <div
          in:fade
          style:--locker-img="url('/floorMaps/{selectedBuildingId}/{selectedFloor}/{selectedSectionId}.svg')"
          class="locker h-full w-full animate-pulse transition-all" />
      {/if}
    {:else}
      <Skeleton class="w-full h-full rounded-xl bg-gray-300" />
    {/if}
  </div>
{/key}

<style lang="postcss">
  /*noinspection CssUnresolvedCustomProperty*/
  .locker {
    background-image: var(--locker-img);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
</style>
