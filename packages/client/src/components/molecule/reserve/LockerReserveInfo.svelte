<script lang="ts">
  import Skeleton from '../../atom/Skeleton.svelte';
  import LockerLoadingScreen from '../../atom/LockerLoadingScreen.svelte';
  import LockerList from './LockerList.svelte';
  import LockerSectionSelector from './LockerSectionSelector.svelte';
  import FloorMap from '../../atom/FloorMap.svelte';

  export let serviceConfig: ServiceConfig;
  export let targetDepartmentId: string;
  $: buildings = serviceConfig?.buildings ?? {};

  let selectedBuildingId: string;
  let selectedFloor: string;
  let selectedSectionId: string;
  export let selectedLockerId: string;
  $: selectedSection =
    serviceConfig?.buildings?.[selectedBuildingId]?.lockers?.[selectedFloor]?.[selectedSectionId];
  export let reservedLockerIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let errorData: LockerError;

  let lockerList: { lockerId: string; disabled: boolean; reserved: boolean }[] = [];
  let lockerGridHeight: number = 0;

  function getSectionRange(subsections: LockerSubsection[]) {
    return subsections.reduce(
      ([min, max], subsection) => {
        const newMin = min < 0 || subsection.range[0] < min ? subsection.range[0] : min;
        const newMax = max < 0 || subsection.range[1] > max ? subsection.range[1] : max;
        return [newMin, newMax];
      },
      [-1, -1],
    );
  }

  function constructLockerId(
      buildingId: string,
      floor: string,
      section: string,
      num: number,
    ): string {
      const fixedLengthNum = `${num}`.padStart(3, '0');
      return `${buildingId}-${floor}-${section}${fixedLengthNum}`;
    }

  $: if (selectedSection && reservedLockerIds) {
    const sectionRange = getSectionRange(selectedSection.subsections);
    const lockerCount = sectionRange[1] - sectionRange[0] + 1;


    lockerList = new Array(lockerCount).fill(0).map((_, idx) => {
      const lockerNum = sectionRange[0] + idx;
      const lockerId = constructLockerId(
        selectedBuildingId,
        selectedFloor,
        selectedSectionId,
        lockerNum,
      );
      const disabled = selectedSection.disabled.includes(lockerNum);
      const reserved = reservedLockerIds.includes(lockerId);
      return {
        lockerId,
        disabled,
        reserved,
      };
    });
    lockerGridHeight = selectedSection.height;
  }
</script>

<div class="h-max-content flex w-auto flex-col items-start lg:min-h-screen">
  <div
    class="flex min-h-[280px] w-full grow flex-col-reverse justify-between gap-4 py-4 lg:flex-row lg:px-8">
    <div
      class="flex w-full shrink flex-col items-stretch overflow-hidden bg-slate-200 p-8 lg:w-1/2 lg:max-w-[480px] lg:basis-1/2 lg:rounded-xl">
      {#if serviceConfig && targetDepartmentId}
        <LockerSectionSelector
          {buildings}
          {targetDepartmentId}
          bind:selectedBuildingId
          bind:selectedFloor
          bind:selectedSectionId />
      {:else}
        <Skeleton class="mb-4 h-10 w-48 rounded-lg bg-gray-300" />
        <div class="flex h-5/6 w-full gap-2">
          <Skeleton class="h-64 w-1/2 rounded-xl bg-gray-300" />
          <Skeleton class="h-64 w-1/2 rounded-xl bg-gray-300" />
        </div>
      {/if}
    </div>
    <div
      class="flex h-full w-full grow flex-col gap-4 overflow-hidden bg-slate-200 p-8 lg:basis-1/2 lg:rounded-xl">
      {#if serviceConfig && selectedBuildingId && selectedFloor}
        <h4 class="text-3xl">배치도</h4>
        <FloorMap
          class="max-h-[50vh] aspect-video grow rounded-xl"
          {selectedBuildingId}
          {selectedFloor}
          {selectedSectionId} />
      {:else}
        <Skeleton class="h-10 w-48 rounded-lg bg-gray-300" />
        <Skeleton class="aspect-4/3 max-h-[50vh] grow rounded-xl bg-gray-300" />
      {/if}
    </div>
  </div>
  <div class="locker-grid flex w-full items-center self-stretch overflow-x-auto overflow-y-visible">
    {#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
      {#if selectedSection && reservedLockerIds}
        <LockerList
          bind:selectedId={selectedLockerId}
          lockers={lockerList}
          height={lockerGridHeight} />
      {:else}
        <LockerLoadingScreen class="min-h-[340px] w-full" message="로드 중.." />
      {/if}
    {/key}
  </div>
</div>

<style lang="postcss">
  /* -------------- 사물함 그리드 영역 -------------- */
  .locker-grid {
    scrollbar-color: #c2c2c2 #e0e0e0;
    scrollbar-width: thin;
  }
</style>
