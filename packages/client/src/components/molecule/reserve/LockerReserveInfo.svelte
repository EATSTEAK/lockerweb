<script lang='ts'>
	import Skeleton from '../../atom/Skeleton.svelte';
	import LockerLoadingScreen from '../../atom/LockerLoadingScreen.svelte';
	import LockerItemGroup from './LockerList.svelte';
	import LockerSectionSelector from './LockerSectionSelector.svelte';

	export let serviceConfig: ServiceConfig;
	export let targetDepartmentId: string;
	$: buildings = serviceConfig?.buildings ?? {};

	let selectedBuildingId: string;
	let selectedFloor: string;
	let selectedSectionId: string;
	$: selectedSection = serviceConfig?.buildings?.[selectedBuildingId]?.lockers?.[selectedFloor]?.[selectedSectionId];

	let lockerList: [string, boolean][] = [];
	let lockerGridHeight: number = 0;

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

		lockerList = new Array(lockerCount).fill(0)
			.map((_, idx) =>
				[
					constructLockerId(selectedBuildingId, selectedFloor, selectedSectionId, sectionRange[0] + idx),
					false
				]);
		lockerGridHeight = selectedSection.height;
	}
</script>

<div class='w-auto h-max-content md:min-h-screen flex flex-col items-start'>
	<div class='grow flex flex-col-reverse md:flex-row justify-between min-h-[280px] w-full'>
		<div class='bg-[#d8dee5] md:basis-1/2 w-full md:w-1/2 md:max-w-[480px] shrink flex flex-col'>
			{#if serviceConfig && targetDepartmentId}
				<LockerSectionSelector {buildings} {targetDepartmentId}
															 bind:selectedBuildingId
															 bind:selectedFloor
															 bind:selectedSectionId />
			{:else}
				<Skeleton class='rounded-lg h-10 w-48 ml-8 my-2 mt-8 bg-gray-300' />
				<div class='h-5/6 flex w-full gap-2 px-8 pb-8'>
					<Skeleton class='h-64 rounded-xl bg-gray-300 w-1/2' />
					<Skeleton class='h-64 rounded-xl bg-gray-300 w-1/2' />
				</div>
			{/if}
		</div>
		<div class='bg-slate-200 md:basis-1/2 grow'>
			{#if serviceConfig}
				<div class='p-8 w-full h-full flex justify-center items-center'>
					<img class='max-w-full h-auto max-h-[370px]' src='/floorMaps/1F.svg' alt='정보과학관 1층 이미지'
							 aria-level='정보과학관 1층 이미지'>
				</div>
			{:else}
				<Skeleton class='w-full h-full max-h-[370px] bg-gray-300' />
			{/if}
		</div>
	</div>
	<div class='locker-grid flex items-center overflow-x-scroll overflow-y-visible w-full self-stretch'>
		{#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
			{#if selectedSection}
				<LockerItemGroup lockers={lockerList} height={lockerGridHeight} />
			{:else}
				<LockerLoadingScreen class='w-full min-h-[340px]' message='로드 중...' />
			{/if}
		{/key}
	</div>
</div>

<style>
    /* -------------- 사물함 그리드 영역 -------------- */
    .locker-grid {
        scrollbar-color: #c2c2c2 #e0e0e0;
        scrollbar-width: thin;
    }
</style>