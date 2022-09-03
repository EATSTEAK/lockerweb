<script lang='ts'>
	import SelectionListItemGroup from '../../atom/SelectionListItemGroup.svelte';
	import SelectionListItem from '../../atom/SelectionListItem.svelte';
	import LockerItem from './LockerItem.svelte';
	import Skeleton from '../../atom/Skeleton.svelte';
	import LockerLoadingScreen from '../../atom/LockerLoadingScreen.svelte';

	export let buildingConfig: ServiceConfig;
	export let userDepartmentId: string;
	export let selectedLocationDataFetchStatus: boolean = true;

	// let menuConfig: string[];
	// let menuConfig: Lockers = {};
	let menuConfig: string[];
	let isMenuConfigConverted: boolean = false;

	let selections: string[] = [];

	let Floors: [];
	let section: string;

	let filteredUserLockerSections: Object[];
	let filteredSectionList: [];

	let selectedBuildingId: number = 21;
	let selectedFloors: number = undefined;
	let selectedForSections: string | undefined;

	let selectedSectionIndex: number[] = new Array(menuConfig?.length).fill(0);
	let selectedSections: string = undefined;

	$: if (filteredSectionList) {
		let selectedSectionLockerRange = filteredSectionList.map(areaConfigOBJ => {
			if (areaConfigOBJ?.sectionName === selectedSections) {
				return areaConfigOBJ.section.subsections[0].range;
			}
		});
		selectedSectionLockerRange = selectedSectionLockerRange.filter(Array => Array !== undefined)[0];
		lockerBeginNumber = selectedSectionLockerRange?.[0];
		lockerEndNumber = selectedSectionLockerRange?.[1];
		lockerRangeCount = lockerEndNumber - lockerBeginNumber;
		console.log('test', selectedSectionLockerRange);
		console.log('사물함 전체 갯수', lockerRangeCount);
	}

	let lockerGridHeight: number | undefined = 5;
	let lockerBeginNumber: number | undefined;
	let lockerEndNumber: number | undefined;
	let lockerRangeCount: number | undefined;
	let lockerGridWidthScale: number | undefined = (5 * (lockerRangeCount / lockerGridHeight)) + 1;
	let lockerGridHeightScale: number | undefined = 5 * lockerGridHeight;

	function floorSortingCondition(a, b) {
		if (a < b) return -1;
		if (a > b) return 1;
		if (a === b) return 0;
		else return -1;
	}

	$: {

		// console.log(menuConfig);
		// console.log(filteredUserLockerSections?.filter(s => s?.floor === selectedForSections));
	}

	$: if (buildingConfig && userDepartmentId) {
		const allLockers = buildingConfig.buildings[selectedBuildingId].lockers;
		console.log('AllLockers');
		console.log(Object.entries(allLockers));
		const allSections: Array<{ floor: string, sectionName: string, section: LockerSection }> = Object.entries(allLockers).flatMap(([floor, sections]) => {
			return Object.entries(sections).map(([sectionName, section]) => ({ floor, sectionName, section }));
		});
		const departmentSections: Array<{ floor: string, sectionName: string, section: LockerSection }> = allSections.filter((sectionData) => {
			return sectionData.section.subsections.some((subsection: LockerSubsection) => subsection.department === userDepartmentId);
		});
		filteredUserLockerSections = departmentSections;
		const filteredConfig: Set<string> = departmentSections.map(department => department.floor)
			.reduce((set, floor) => set.add(floor), new Set<string>());
		menuConfig = Array.from<string>(filteredConfig as ArrayLike<string>);
		console.log(departmentSections);
		menuConfig = menuConfig.map(x => x.includes('B') ? x.replace('B', '-') : x).sort();
		menuConfig = menuConfig.map(x => x.includes('-') ? x.replace('-', 'B') : x).reverse();
		isMenuConfigConverted = true;
		console.log(menuConfig);
	}

	$: {
		selectedForSections = menuConfig?.[selectedFloors];
		filteredSectionList = filteredUserLockerSections?.filter(s => s?.floor === selectedForSections);
		selectedSections = filteredSectionList?.[selectedSectionIndex?.[selectedFloors]]?.sectionName;
		console.log('선택된 구역 인덱스: ', selectedSectionIndex[selectedFloors]);
		console.log('----');
		console.log(selectedFloors);
		console.log('filteredSectonList', filteredSectionList);
		console.log('selectedInedx', selectedSectionIndex);
		console.log('selectedSection', selectedSections);
		console.log('selectedForSection', selectedForSections);
	}
	// $: filteredUserLockerSections = filteredUserLockerSections?.filter(s => s?.floor === selectedForSections);
</script>

<div class='wrap'>
	<div class='select-info'>
		<div class='select-location'>
			{#if isMenuConfigConverted}
				<h4 class='text-3xl my-2 mt-8 ml-8'>구역 선택</h4>
				<div class='location-depths'>
					<div class='select-floor'>
						<SelectionListItemGroup bind:selectedIndex={selectedFloors} class='location-select-group'>
							{#each menuConfig as item, index}
								<SelectionListItem id={index} class='location-select-item'>{item}</SelectionListItem>
							{/each}
						</SelectionListItemGroup>
					</div>
					<div class='select-area'>
						<SelectionListItemGroup bind:selectedIndex={selectedSectionIndex[selectedFloors]}>
							{#each filteredSectionList as section, index}
								<SelectionListItem id={index}
																	 class='location-select-item'>{section.sectionName}</SelectionListItem>
							{/each}
						</SelectionListItemGroup>
					</div>
				</div>
			{:else}
				<Skeleton class='rounded-lg h-10 w-48 ml-8 my-2 mt-8 bg-gray-300'>구역 선택</Skeleton>
				<div class='location-depths'>
					<div class='select-floor'>
						<Skeleton class='location-select-group h-64 rounded-xl bg-gray-300' />
					</div>
					<div class='select-area'>
						<Skeleton class='h-64 rounded-xl bg-gray-300' />
					</div>
				</div>
			{/if}
		</div>
		{#if buildingConfig}
			<div class='locker-map'>
				<img class='map-img' src='/floorMaps/1F.svg' alt='정보과학관 1층 이미지' aria-level='정보과학관 1층 이미지'>
			</div>
		{:else}
			<Skeleton class='locker-map-skeleton bg-gray-300' />
		{/if}
	</div>
	{#if buildingConfig}
		<div class='grow flex items-center overflow-scroll'>
			<div class='locker-grid flex flex-col flex-wrap mt-5 ml-auto mr-auto'
					 style={`width:${lockerGridWidthScale}rem; height:${lockerGridHeightScale}rem;`}>
				{#each { length: lockerRangeCount } as _, i}
					<LockerItem lockerLocation='A' lockerNumber={i+1} />
				{/each}
			</div>
		</div>
	{:else}
		<LockerLoadingScreen />
	{/if}
</div>

<style>
    .wrap {
        /* width: auto; 가 아닌 width: 100%; 라면 overflow 된 자식 요소의 크기를 따라간다?? */
        @apply w-auto h-screen flex flex-col;
    }

    /* -------------- 영역 선택 및 지도 -------------- */
    .select-info {
        @apply flex flex-row min-h-[370px];
    }

    .select-location {
        @apply bg-[#d8dee5] w-fit md:min-w-[470px];
    }

    .locker-map {
        @apply bg-slate-200 grow;
    }


    .location-depths {
        @apply w-full h-5/6 flex;
    }

    .select-floor {
        @apply pl-8 pr-1 w-1/2;
    }

    .select-area {
        @apply pr-8 pl-1 w-1/2;
    }

    .location-select-group {
        @apply h-full;
    }

    :global(.location-select-item) {
        @apply h-11;
    }

    .locker-map {
        @apply flex max-h-[370px];
    }

    :global(.locker-map-skeleton) {
        @apply grow max-h-[370px];
    }

    .map-img {
        @apply flex max-h-[270px] ml-auto mr-auto mt-10;
    }

    /* -------------- 사물함 그리드 영역 -------------- */
    .locker-grid {
        scrollbar-color: #c2c2c2 #e0e0e0;
        scrollbar-width: thin;
    }
</style>