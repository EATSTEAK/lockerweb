<script lang="ts">
  import { fly } from 'svelte/transition';
  import {
    Image,
    type KonvaDragTransformEvent,
    type KonvaTouchEvent,
    type KonvaWheelEvent,
    Layer,
    Stage,
  } from 'svelte-konva';
  import type { Stage as StageHandle } from 'konva/lib/Stage';
  import { beforeUpdate, onMount } from 'svelte';
  import Skeleton from './Skeleton.svelte';
  import Button from './Button.svelte';
  import ArrowClockwise from '../../icons/ArrowClockwise.svelte';
  import Konva from 'konva';
  import type { IFrame } from 'konva/lib/types';
  import { sineInOut } from 'svelte/easing';

  let clazz = '';
  export { clazz as class };
  export let alt = '배치도';
  export let src: string;
  export let highlightSrc: string = null;
  export let highlightX: number = 0;
  export let highlightY: number = 0;

  let parent: HTMLDivElement;
  let stage: StageHandle;
  let image: HTMLImageElement;
  let highlightImage: HTMLImageElement;
  let highlight: Konva.Image;
  let width: number;
  let height: number;
  let resizeCallback: NodeJS.Timeout;
  let imageRatio: number;
  let zoomScale = 1;
  let stageX = 0;
  let stageY = 0;
  let defaultScale: number;
  let mounted: boolean = false;
  let highlightAnimation: Konva.Animation = null;

  $: canvasRatio = width && height && width / height;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function resizeCanvas(_entries: ResizeObserverEntry[], _observer: ResizeObserver) {
    if (resizeCallback) clearTimeout(resizeCallback);
    if (parent && (width !== parent.clientWidth || height !== parent.clientHeight)) {
      width = undefined;
      height = undefined;
      resizeCallback = setTimeout(function() {
        if (parent) {
          width = parent?.clientWidth;
          height = parent?.clientHeight;
        }
        resizeCallback = undefined;
      }, 500);
    }
  }

  function getDistance(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1: { x: number, y: number }, p2: { x: number, y: number }): { x: number, y: number } {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  let dragStopped: boolean = false;
  let lastCenter: { x: number, y: number } = null;
  let lastDist: number = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function resetTouchPosition(_e: KonvaTouchEvent) {
    lastCenter = null;
    lastDist = null;
  }

  function zoomMapWithTouch(e: KonvaTouchEvent): void {
    e.detail.evt.preventDefault();
    const touch1 = e.detail.evt.touches[0];
    const touch2 = e.detail.evt.touches[1];

    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
      stage.startDrag();
      dragStopped = false;

    }

    if (touch1 && touch2) {
      if (!dragStopped) {
        dragStopped = true;
        stage.stopDrag();
      }
      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };
      if (!lastCenter) {
        lastCenter = getCenter(p1, p2);
        return;
      }
      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);

      if (!lastDist) {
        lastDist = dist;
      }

      const oldScale = zoomScale;

      const pointTo = {
        x: (newCenter.x - stage.x()) / oldScale,
        y: (newCenter.y - stage.y()) / oldScale,
      };

      console.log(oldScale, ((dist / lastDist)));
      const newScale = oldScale * (dist / lastDist);

      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos = {
        x: newCenter.x - pointTo.x * newScale + dx,
        y: newCenter.y - pointTo.y * newScale + dy,
      };

      if (newScale <= defaultScale * 4.0 && newScale >= defaultScale * 0.25) {
        zoomScale = newScale;
      }

      stageX = newPos.x;
      stageY = newPos.y;

      lastDist = dist;
      lastCenter = newCenter;
    }
  }


  function zoomMapWithWheel(e: KonvaWheelEvent): void {
    // Enable zoom only when user scroll with ctrl key
    if (e.detail.evt.ctrlKey) {
      e.detail.evt.preventDefault();
      let oldScale = zoomScale;
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let direction = e.detail.evt.deltaY > 0 ? -1 : 1;

      let newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
      // Allow zoom level from 0.25 to 4.0
      if (newScale <= defaultScale * 4.0 && newScale >= defaultScale * 0.25) {
        zoomScale = newScale;
        stageX = pointer.x - mousePointTo.x * zoomScale;
        stageY = pointer.y - mousePointTo.y * zoomScale;
      }
    }
  }

  function reset() {
    stageX = (width && image.width && defaultScale) ? (width - (image.width * defaultScale)) / 2 : 0;
    stageY = 0;
    zoomScale = defaultScale;
  }

  function updateStageCoords(e: KonvaDragTransformEvent): void {
    stageX = e.detail.target.x();
    stageY = e.detail.target.y();
  }

  onMount(() => {
    width = parent?.clientWidth;
    height = parent?.clientHeight;
    new ResizeObserver(resizeCanvas).observe(parent);
    mounted = true;
  });

  beforeUpdate(() => {
    if (highlightAnimation) highlightAnimation.stop();
    highlightAnimation = null;
  });

  $: if (mounted && src) {
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      image = img;
      imageRatio = img.width / img.height;
    };
  }

  $: if (mounted && highlightSrc) {
    const highlightImg = document.createElement('img');
    highlightImg.src = highlightSrc;
    highlightImg.onload = () => {
      highlightImage = highlightImg;
    };
    // TODO: move camera to highlighted position
  }

  const easing = (currentTime: number, repeatTime: number) => {
    const flowVal = Math.abs((currentTime % repeatTime) - (repeatTime / 2)) / (repeatTime / 2); // 0~1
    return sineInOut(flowVal);
  };

  $: if (highlight) {
    if (highlightAnimation) highlightAnimation.stop();
    highlightAnimation = new Konva.Animation((frame: IFrame) => {
      highlight.setAttr('opacity', (easing(frame.time, 3000) * 0.8) + 0.2);
    });
    highlightAnimation.start();
  }

  $: if (imageRatio && canvasRatio) {
    defaultScale = canvasRatio >= imageRatio ? height / image.height : width / image.width;
    zoomScale = defaultScale;
    reset();
  }
</script>

<div
  bind:this={parent}
  class="{clazz} relative h-full w-full cursor-grab"
  in:fly={{ y: 100, duration: 300 }}
  aria-label={alt}>
  {#if !isNaN(width) && !isNaN(height)}
    {#key `${width};${height}`}
      <Stage
        bind:handle={stage}
        config={{ width, height, scale: { x: zoomScale, y: zoomScale }, x: stageX, y: stageY, draggable: true }}
        on:wheel={zoomMapWithWheel}
        on:dragend={updateStageCoords}
        on:touchmove={zoomMapWithTouch}
        on:touchend={resetTouchPosition}
      >
        <Layer>
          <Image config={{ image, x: 0, y: 0 }}></Image>
          {#if highlightImage}
            <Image config={{ image: highlightImage, x: highlightX, y: highlightY }} bind:handle={highlight}></Image>
          {/if}
        </Layer>
      </Stage>
    {/key}
    {#if stageX !== 0 || stageY !== 0 || zoomScale !== defaultScale}
      <Button class="absolute bottom-0 right-0 m-4 bg-white" on:click={reset}>
        <ArrowClockwise />
      </Button>
    {/if}
  {:else}
    <Skeleton class="w-full h-full rounded-xl bg-gray-300" />
  {/if}
</div>
