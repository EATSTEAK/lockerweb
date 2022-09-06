<script lang='ts'>
	import LockerItem from './LockerItem.svelte';
	import Skeleton from '../../atom/Skeleton.svelte';
	import LockerLoadingScreen from '../../atom/LockerLoadingScreen.svelte';
	import LockerItemGroup from './LockerItemGroup.svelte';
	import LockerSectionSelector from './LockerSectionSelector.svelte';
	import SelectedLockerAlert from '../SelectedLockerAlert.svelte';

	let innerWidth: number = 0;

	export let serviceConfig: ServiceConfig;
	export let targetDepartmentId: string;
	$: buildings = serviceConfig?.buildings ?? {};

	let selectedBuildingId: string;
	let selectedFloor: string;
	let selectedSectionId: string;
	let selectedLockerNum: number;
	$: selectedSection = serviceConfig?.buildings?.[selectedBuildingId]?.lockers?.[selectedFloor]?.[selectedSectionId];

	let lockerList: Array<string> = [];

	let lockerGridHeight: number | undefined = 5;
	$: lockerGridWidthScale = (5 * (lockerList.length / lockerGridHeight)) + 1;
	$: lockerGridHeightScale = 5 * lockerGridHeight;

	function getSectionRange(subsections: LockerSubsection[]) {
		return subsections.reduce(([min, max], subsection) => {
			const newMin = min < 0 || subsection.range[0] < min ? subsection.range[0] : min;
			const newMax = max < 0 || subsection.range[1] > max ? subsection.range[1] : max;
			return [newMin, newMax];
		}, [-1, -1]);
	}

	$: if (selectedSection) {
		const sectionRange = getSectionRange(selectedSection.subsections);
		const lockerCount = sectionRange[1] - sectionRange[0] + 1;

		function constructLockerId(buildingId: string, floor: string, section: string, num: number): string {
			const fixedLengthNum = `${num}`.padStart(3, '0');
			return `${buildingId}-${floor}-${section}${fixedLengthNum}`;
		}

		lockerList = new Array(lockerCount).fill(0).map((_, idx) => constructLockerId(selectedBuildingId, selectedFloor, selectedSectionId, sectionRange[0] + idx));
		lockerGridHeight = selectedSection.height;
	}

	/** selected locker alert */
	let alertActive: boolean = false;
	$: (selectedBuildingId && selectedFloor && selectedSection && selectedLockerNum) ? alertActive = true : alertActive = false;
</script>

<div bind:clientWidth={innerWidth} class='wrap'>
	{#if alertActive}
		<SelectedLockerAlert {selectedFloor} {selectedSection} {selectedLockerNum} width={innerWidth} />
	{/if}
	<div class='select-info'>
		<div class='select-location'>
			{#if serviceConfig && targetDepartmentId}
				<LockerSectionSelector {buildings} {targetDepartmentId}
															 bind:selectedBuildingId
															 bind:selectedFloor
															 bind:selectedSectionId />
			{:else}
				<Skeleton class='rounded-lg h-10 w-48 ml-8 my-2 mt-8 bg-gray-300'>구역 선택</Skeleton>
				<div class='w-full h-5/6 flex'>
					<div class='pl-8 pr-1 w-1/2'>
						<Skeleton class='location-select-group h-64 rounded-xl bg-gray-300' />
					</div>
					<div class='pr-8 pl-1 w-1/2'>
						<Skeleton class='h-64 rounded-xl bg-gray-300' />
					</div>
				</div>
			{/if}
		</div>
		{#if serviceConfig}
			<div class='locker-map'>
				<img class='map-img' src='/floorMaps/1F.svg' alt='정보과학관 1층 이미지' aria-level='정보과학관 1층 이미지'>
			</div>
		{:else}
			<Skeleton class='locker-map-skeleton bg-gray-300' />
		{/if}
	</div>
	{#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
		{#if selectedSection}
			<div class='grow flex items-center overflow-scroll'>
				<LockerItemGroup class='locker-grid' widthScale={lockerGridWidthScale} heightScale={lockerGridHeightScale}>
					{#each lockerList as lockerId, index}
						<LockerItem id={lockerId} />
					{/each}
				</LockerItemGroup>
			</div>
		{:else}
			<LockerLoadingScreen message='로드 중...' />
		{/if}
	{/key}
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