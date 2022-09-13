<script lang="ts">
  import SelectionListItemGroup from '../../atom/SelectionListItemGroup.svelte';
  import SelectionListItem from '../../atom/SelectionListItem.svelte';
  import { getBuildingName } from '$lib/utils';

  export let buildings: {
    [buildingId: string]: Building;
  };

  type Floor = {
    buildingId: string;
    floor: string;
  };
  export let targetDepartmentId: string;
  export let selectedBuildingId: string;
  export let selectedFloor: string;
  export let selectedSectionId: string;
  let floorList = [];
  let sectionList = [];

  function sortFloor(a: Floor, b: Floor): number {
    if (parseInt(a.buildingId) > parseInt(b.buildingId)) return 1;
    if (parseInt(a.buildingId) < parseInt(b.buildingId)) return -1;
    if (parseInt(a.buildingId) === parseInt(b.buildingId)) {
      const aFloor = parseInt(a.floor.replace('B', '-'));
      const bFloor = parseInt(b.floor.replace('B', '-'));
      if (aFloor < bFloor) return 1;
      if (aFloor > bFloor) return -1;
      if (aFloor === bFloor) return 0;
    }
  }

  $: if (buildings && targetDepartmentId && !floorList.length) {
    floorList = constructFloorListByDepartment(buildings, targetDepartmentId).sort(sortFloor);
  }
  $: if (buildings && targetDepartmentId && typeof selectedFloorIndex === 'number') {
    sectionList = constructSectionListByDepartmentAndFloor(buildings, targetDepartmentId, {
      buildingId: selectedBuildingId,
      floor: selectedFloor,
    });
  }

  function getFloorDisplay(floor: string): string {
    if (!floor.startsWith('B')) return `${floor}F`;
    return floor;
  }

  function isReservableSection(section: LockerSection, departmentId: string) {
    return section.subsections.some((subsection) => subsection.department === departmentId);
  }

  function constructFloorListByDepartment(
    buildings: { [buildingId: string]: Building },
    departmentId: string,
  ): Floor[] {
    function isReservableFloor(
      lockers: { [lockerName: string]: LockerSection },
      departmentId: string,
    ): boolean {
      return Object.values(lockers).some((section) => isReservableSection(section, departmentId));
    }

    return Object.entries(buildings).flatMap(([id, building]) =>
      Object.entries(building.lockers)
        .filter(([floor, lockers]) => isReservableFloor(lockers, departmentId))
        .map(([floor, lockers]) => ({
          buildingId: id,
          floor,
        })),
    );
  }

  function constructSectionListByDepartmentAndFloor(
    buildings: { [buildingId: string]: Building },
    departmentId: string,
    floor: Floor,
  ): string[] {
    const targetFloor = buildings[floor.buildingId].lockers[floor.floor];
    return Object.entries(targetFloor)
      .filter(([sectionId, section]) => isReservableSection(section, departmentId))
      .map(([sectionId, section]) => sectionId);
  }

  let selectedFloorIndex: number;
  let selectedSectionIndex: number;

  $: if (typeof selectedFloorIndex === 'number') {
    selectedBuildingId = floorList[selectedFloorIndex].buildingId;
    if (selectedFloor !== floorList[selectedFloorIndex].floor) {
      selectedSectionIndex = undefined;
    }
    selectedFloor = floorList[selectedFloorIndex].floor;
  }

  $: if (typeof selectedSectionIndex === 'number') {
    selectedSectionId = sectionList[selectedSectionIndex];
  }
</script>

<h4 class="mb-2 text-3xl">구역 선택</h4>
<div class="flex h-5/6 gap-1">
  <div class="basis-1/2">
    {#key `${selectedBuildingId}-${selectedFloor}`}
      <SelectionListItemGroup bind:selectedIndex={selectedFloorIndex} class="h-full">
        {#each floorList as item, index}
          <SelectionListItem
            id="{item.buildingId}-{item.floor}"
            class="min-h-11 focus:!brightness-95"
            ><span class="text-sm text-gray-500"
              >{getBuildingName(buildings, item.buildingId)}
              |
            </span>{getFloorDisplay(item.floor)}</SelectionListItem
          >
        {/each}
      </SelectionListItemGroup>
    {/key}
  </div>
  <div class="basis-1/2">
    {#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
      <SelectionListItemGroup bind:selectedIndex={selectedSectionIndex}>
        {#each sectionList as section, index}
          <SelectionListItem
            id="{selectedBuildingId}-{selectedFloor}-{section}"
            class="min-h-11 focus:!brightness-95"
            >{section} 구역
          </SelectionListItem>
        {/each}
      </SelectionListItemGroup>
    {/key}
  </div>
</div>
