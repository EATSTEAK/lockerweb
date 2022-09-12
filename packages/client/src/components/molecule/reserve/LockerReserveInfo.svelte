<script lang='ts'>
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
	let selectedLockerNum: number;
	$: if (selectedLockerId) {
		const [, , location] = selectedLockerId.split('-');
		selectedLockerNum = parseInt(location.slice(1));
	} else {
		selectedLockerNum = undefined;
	}
	$: selectedSection = serviceConfig?.buildings?.[selectedBuildingId]?.lockers?.[selectedFloor]?.[selectedSectionId];
	export let reservedLockerIds: string[];
	let errorData: LockerError;

	let lockerList: { lockerId: string, disabled: boolean, reserved: boolean }[] = [];
	let lockerGridHeight: number = 0;

	function getSectionRange(subsections: LockerSubsection[]) {
		return subsections.reduce(([min, max], subsection) => {
			const newMin = min < 0 || subsection.range[0] < min ? subsection.range[0] : min;
			const newMax = max < 0 || subsection.range[1] > max ? subsection.range[1] : max;
			return [newMin, newMax];
		}, [-1, -1]);
	}

	$: if (selectedSection && reservedLockerIds) {
		const sectionRange = getSectionRange(selectedSection.subsections);
		const lockerCount = sectionRange[1] - sectionRange[0] + 1;

		function constructLockerId(buildingId: string, floor: string, section: string, num: number): string {
			const fixedLengthNum = `${num}`.padStart(3, '0');
			return `${buildingId}-${floor}-${section}${fixedLengthNum}`;
		}

		lockerList = new Array(lockerCount).fill(0)
			.map((_, idx) => {
				const lockerNum = sectionRange[0] + idx;
				const lockerId = constructLockerId(selectedBuildingId, selectedFloor, selectedSectionId, lockerNum);
				const disabled = selectedSection.disabled.includes(lockerNum);
				const reserved = reservedLockerIds.includes(lockerId);
				return {
					lockerId,
					disabled,
					reserved
				};
			});
		lockerGridHeight = selectedSection.height;
	}
</script>


<div class='w-auto h-max-content md:min-h-screen flex flex-col items-start'>
	<div
		class='grow flex flex-col-reverse md:flex-row justify-between min-h-[280px] w-full py-4 md:px-8 gap-4'>
		<div
			class='bg-slate-200 md:basis-1/2 w-full md:w-1/2 md:max-w-[480px] items-stretch shrink flex flex-col md:rounded-xl overflow-hidden p-8'>
			{#if serviceConfig && targetDepartmentId}
				<LockerSectionSelector {buildings} {targetDepartmentId}
															 bind:selectedBuildingId
															 bind:selectedFloor
															 bind:selectedSectionId />
			{:else}
				<Skeleton class='rounded-lg h-10 w-48 bg-gray-300 mb-4' />
				<div class='h-5/6 flex w-full gap-2'>
					<Skeleton class='h-64 rounded-xl bg-gray-300 w-1/2' />
					<Skeleton class='h-64 rounded-xl bg-gray-300 w-1/2' />
				</div>
			{/if}
		</div>
		<div
			class='w-full h-full flex flex-col md:rounded-xl overflow-hidden bg-slate-200 md:basis-1/2 grow p-8 gap-4'>
			{#if serviceConfig && selectedBuildingId && selectedFloor}
				<h4 class='text-3xl'>배치도</h4>
				<FloorMap class='grow rounded-xl aspect-4/3 max-h-[50vh]' {selectedBuildingId} {selectedFloor}
									{selectedSectionId} />
			{:else}
				<Skeleton class='rounded-lg h-10 w-48 bg-gray-300' />
				<Skeleton class='grow rounded-xl bg-gray-300 aspect-4/3 max-h-[50vh]' />
			{/if}
		</div>
	</div>
	<div class='locker-grid flex items-center overflow-x-auto overflow-y-visible w-full self-stretch'>
		{#key `${selectedBuildingId}-${selectedFloor}-${selectedSectionId}`}
			{#if selectedSection && reservedLockerIds}
				<LockerList bind:selectedId={selectedLockerId} lockers={lockerList} height={lockerGridHeight} />
			{:else}
				<LockerLoadingScreen class='w-full min-h-[340px]' message='로드 중..' />
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