<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import Button from '../atom/Button.svelte';
  import Bookmark from '../../icons/Bookmark.svelte';
  import { config } from '$lib/store';
  import { getServiceConfig } from '$lib/api/config';
  import { extractLockerInfoFromId, getBuildingName } from '$lib/utils.js';

  export let width: number;

  export let selectedLockerId: string;
  let buildingId: string;
  let floor: string;
  let sectionId: string;
  let lockerNum: number;
  $: if (selectedLockerId) {
    const lockerInfo = extractLockerInfoFromId(selectedLockerId);
    buildingId = lockerInfo.buildingId;
    floor = lockerInfo.floor;
    sectionId = lockerInfo.sectionId;
    lockerNum = lockerInfo.lockerNum;
  }

  export let primaryClass: string = '';
  export let secondaryClass: string = '';

  $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

  let clazz = '';
  export { clazz as class };

  const dispatch = createEventDispatcher();

  function click(btnType: 'primary' | 'secondary') {
    if (btnType === 'primary') {
      dispatch('click', {});
    } else if (btnType === 'secondary') {
      dispatch('click:secondary', {});
    }
  }
</script>

<div
  transition:fly={{ y: 10, duration: 150 }}
  class="{clazz} fixed bottom-5 right-5 z-20 flex
 	flex-row flex-wrap rounded-xl bg-gray-800/75
	px-2 backdrop-blur-sm"
  style={`width:${width - 42}px;`}
>
  <div class="flex flex-row flex-wrap items-center gap-2 px-1">
    <h6 class="my-2 rounded-lg bg-gray-700/80 py-1 px-2 text-white">선택됨</h6>
    <div class="flex flex-row gap-1">
      <h6 class="font-semibold italic text-green-200">
        {getBuildingName(serviceConfig?.buildings, buildingId)}<span class="pl-2 not-italic">|</span
        >
      </h6>
      <h6 class="font-semibold italic text-green-200">
        {floor}층<span class="pl-2 not-italic">|</span>
      </h6>
      <h6 class="font-semibold italic text-green-200">{sectionId}구역-{lockerNum}</h6>
    </div>
  </div>
  <div class="flex-end mr-1 flex flex-grow flex-row items-center justify-end gap-2">
    <Button
      on:click={() => click('secondary')}
      class="{secondaryClass} bg-gray-200 !py-2 !px-3 text-center text-gray-600 [&[disabled]]:opacity-50"
    >
      선택 해제
    </Button>
    <Button
      on:click={() => click('primary')}
      class="{primaryClass} my-2 !flex-none bg-primary-800 !py-2 !pl-2 text-white [&[disabled]]:opacity-50"
    >
      <Bookmark slot="icon" />
      예약하기
    </Button>
  </div>
</div>
