<script lang="ts">
  import { getBuildingName } from '$lib/utils';
  import { config } from '$lib/store';
  import { getServiceConfig } from '$lib/api/config';
  import { fade, fly } from 'svelte/transition';

  export let selectedBuildingId: string;
  export let selectedFloor: string;
  export let selectedSectionId: string;
  let clazz;
  export { clazz as class };

  let alt = '배치도';

  $: if ($config.success && selectedBuildingId) {
    const serviceConfig = getServiceConfig($config?.result);
    alt = `${getBuildingName(
      serviceConfig.buildings,
      selectedBuildingId,
    )} ${selectedFloor}층 배치도`;
  }
</script>

{#key `${selectedBuildingId}-${selectedFloor}`}
  <div
    style:--bg-img="url('/floorMaps/{selectedBuildingId}/{selectedFloor}.png')"
    class="{clazz} bg h-full w-full"
    in:fly={{ y: 100, duration: 300 }}
    aria-label={alt}
  >
    {#if selectedSectionId}
      <div
        in:fade
        style:--locker-img="url('/floorMaps/{selectedBuildingId}/{selectedFloor}/{selectedSectionId}.svg')"
        class="locker h-full w-full animate-pulse transition-all"
      />
    {/if}
  </div>
{/key}

<style lang="postcss">
  /*noinspection CssUnresolvedCustomProperty*/
  .bg {
    background-image: var(--bg-img);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  /*noinspection CssUnresolvedCustomProperty*/
  .locker {
    background-image: var(--locker-img);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
</style>
