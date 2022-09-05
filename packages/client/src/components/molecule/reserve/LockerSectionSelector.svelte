<script lang='ts'>
	import SelectionListItemGroup from '../../atom/SelectionListItemGroup.svelte';
	import SelectionListItem from '../../atom/SelectionListItem.svelte';

	export let buildings: {
		[buildingId: string]: Building
	};

	type Floor = {
		buildingId: string,
		floor: string
	}
	export let targetDepartmentId: string;
	export let selectedBuildingId: string;
	export let selectedFloor: string;
	export let selectedSectionId: string;
	let floorList = [];
	let sectionList = [];

	$: if (buildings && targetDepartmentId && !floorList.length) {
		floorList = constructFloorListByDepartment(buildings, targetDepartmentId);
	}
	$: if (buildings && targetDepartmentId && typeof selectedFloorIndex === 'number') {
		sectionList = constructSectionListByDepartmentAndFloor(buildings, targetDepartmentId, {
			buildingId: selectedBuildingId,
			floor: selectedFloor
		});
	}

	function getBuildingName(buildingId: string): string {
		return buildings[buildingId]?.name;
	}

	function isReservableSection(section: LockerSection, departmentId: string) {
		return section.subsections.some(subsection => subsection.department === departmentId);
	}

	function constructFloorListByDepartment(buildings: { [buildingId: string]: Building }, departmentId: string): Floor[] {
		function isReservableFloor(lockers: { [lockerName: string]: LockerSection }, departmentId: string): boolean {
			return Object.values(lockers).some(section => isReservableSection(section, departmentId));
		}

		return Object.entries(buildings).flatMap(([id, building]) =>
			Object.entries(building.lockers)
				.filter(([floor, lockers]) => isReservableFloor(lockers, departmentId))
				.map(([floor, lockers]) => ({
					buildingId: id,
					floor
				})));
	}

	function constructSectionListByDepartmentAndFloor(buildings: { [buildingId: string]: Building }, departmentId: string, floor: Floor): string[] {
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

<h4 class='text-3xl my-2 mt-8 ml-8'>구역 선택</h4>
<div class='w-full h-5/6 flex'>
	<div class='pl-8 pr-1 w-1/2'>
		{#key `${selectedBuildingId}-${selectedFloor}`}
			<SelectionListItemGroup bind:selectedIndex={selectedFloorIndex} class='h-full'>
				{#each floorList as item, index}
					<SelectionListItem id='{item.buildingId}-{item.floor}'
														 class='h-11 focus:!brightness-95'>{getBuildingName(item.buildingId)}
						- {item.floor}</SelectionListItem>
				{/each}
			</SelectionListItemGroup>
		{/key}
	</div>
	<div class='pr-8 pl-1 w-1/2'>
		{#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
			<SelectionListItemGroup bind:selectedIndex={selectedSectionIndex}>
				{#each sectionList as section, index}
					<SelectionListItem id='{selectedBuildingId}-{selectedFloor}-{section}'
														 class='h-11 focus:!brightness-95'>{section}</SelectionListItem>
				{/each}
			</SelectionListItemGroup>
		{/key}
	</div>
</div>