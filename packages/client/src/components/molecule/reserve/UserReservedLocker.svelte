<script lang="ts">
  import Skeleton from '../../atom/Skeleton.svelte';
  import Dismiss from '../../../icons/Dismiss.svelte';
  import { getBuildingName } from '$lib/utils.js';
  import { getServiceConfig } from '$lib/api/config';
  import { createEventDispatcher } from 'svelte';
  import { config } from '$lib/store';

  const dispatch = createEventDispatcher();

  export let reservedLocker: ReservedLocker;

  $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

  let buildingId: string;
  let floor: string;
  let section: string;
  let lockerNum: number;
  let claimedUntil: Date;

  $: if (reservedLocker) {
    const [building_, floor_, locker] = reservedLocker.lockerId.split('-');
    buildingId = building_;
    floor = floor_;
    section = locker.slice(0, 1);
    lockerNum = parseInt(locker.slice(1));
    if (reservedLocker.claimedUntil) claimedUntil = reservedLocker.claimedUntil as Date;
  }
  const dateFormatter = new Intl.DateTimeFormat('ko', { timeStyle: 'short', dateStyle: 'short' });
  $: claimedUntilDisplay = claimedUntil ? dateFormatter.format(claimedUntil) : '';
</script>

{#if reservedLocker !== undefined}
  <div class="relative w-full">
    <h4 class="text-4xl">내 정보</h4>
    <h5 class="mt-3 text-xl text-blue-500">예약한 사물함</h5>
    <div
      class:pointer-events-none={reservedLocker === null}
      on:click={() => {
        dispatch('unclaim');
      }}
      class="hover-wrapper relative h-44 w-56 cursor-pointer rounded-2xl">
      <div
        class="absolute right-0 top-0 z-10 mt-4 mr-4 flex flex-col justify-center rounded-lg text-center font-bold text-gray-500">
        <Dismiss />
      </div>
      <div
        class:invisible={reservedLocker !== null}
        class:backdrop-blur-sm={reservedLocker === null}
        class="hover-popup invisible absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center rounded-xl text-2xl font-bold text-gray-600 ring-2 ring-blue-400 drop-shadow-md">
        {#if reservedLocker !== null}
          예약 취소
        {:else}
          <p class="text-xl">예약된 사물함이 없음</p>
        {/if}
      </div>
      <div
        class="user-reserve-box absolute top-0 left-0 z-0 flex h-44 w-56 flex-col items-center gap-1 rounded-2xl bg-white p-2 ring-2 ring-blue-400">
        <div
          class="flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-gray-300 px-2 text-center">
          <div class:invisible={reservedLocker === null} class="location text-2xl font-extrabold">
            {getBuildingName(serviceConfig.buildings, buildingId)}
            {floor}층
          </div>
        </div>
        <div
          class:invisible={reservedLocker === null}
          class="number flex grow items-center text-center text-7xl font-extrabold text-primary-800">
          {section}-{lockerNum}
        </div>
      </div>
    </div>
    {#if claimedUntil}
      <div class="till ml-3 mt-1">{claimedUntilDisplay} 까지</div>
    {/if}
  </div>
{:else}
  <div class="w-full">
    <Skeleton class="mt-9 h-10 w-52 rounded-lg bg-gray-300" />
    <div class="mt-6 flex flex-row">
      <Skeleton class="mr-2 h-32 w-16 rounded-lg bg-gray-300" />
      <Skeleton class="h-32 w-36 rounded-lg bg-gray-300" />
    </div>
    <Skeleton class="mt-2 h-6 w-24 rounded-lg bg-gray-300" />
  </div>
{/if}

<style lang="postcss">
  .hover-wrapper:hover > .user-reserve-box {
    @apply cursor-pointer bg-white opacity-40 transition-all;
  }

  .hover-wrapper:hover > .hover-popup {
    @apply visible rounded-xl backdrop-blur-sm;
  }
</style>
