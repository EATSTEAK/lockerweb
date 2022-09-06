<script lang='ts'>
	import Skeleton from '../../atom/Skeleton.svelte';
	import LockerLoadingScreen from '../../atom/LockerLoadingScreen.svelte';
	import LockerItemGroup from './LockerList.svelte';
	import LockerSectionSelector from './LockerSectionSelector.svelte';
	import SelectedLockerAlert from '../SelectedLockerAlert.svelte';

	let innerWidth: number = 0;
	import { browser } from '$app/env';
	import { apiQueryLocker } from '$lib/api/locker';

	export let serviceConfig: ServiceConfig;
	export let targetDepartmentId: string;
	$: buildings = serviceConfig?.buildings ?? {};

	let selectedBuildingId: string;
	let selectedFloor: string;
	let selectedSectionId: string;
	let selectedLockerNum: number;
	$: selectedSection = serviceConfig?.buildings?.[selectedBuildingId]?.lockers?.[selectedFloor]?.[selectedSectionId];
	let reservedLockers: string[];
	let errorData: LockerError;

	if (browser) {
		queryLockerData();
	}

	let lockerList: { lockerId: string, disabled: boolean, reserved: boolean }[] = [];
	let lockerGridHeight: number = 0;

	function queryLockerData() {
		apiQueryLocker().then((res) => {
			if (res.success) {
				reservedLockers = res.result.map(reservedLocker => reservedLocker.lockerId);
			} else {
				if (res.success === false) {
					errorData = res.error;
				} else {
					console.error(res);
					errorData = {
						code: 500,
						name: 'UnknownError'
					};
				}
			}
		}).catch(e => {
			console.error(e);
			errorData = e;
		});
	}

	function getSectionRange(subsections: LockerSubsection[]) {
		return subsections.reduce(([min, max], subsection) => {
			const newMin = min < 0 || subsection.range[0] < min ? subsection.range[0] : min;
			const newMax = max < 0 || subsection.range[1] > max ? subsection.range[1] : max;
			return [newMin, newMax];
		}, [-1, -1]);
	}

	$: if (selectedSection && reservedLockers) {
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
				const reserved = reservedLockers.includes(lockerId);
				return {
					lockerId,
					disabled,
					reserved
				};
			});
		lockerGridHeight = selectedSection.height;
	}

	/** selected locker alert */
	let alertActive: boolean;
	$: (selectedSection && selectedLockerNum) ? alertActive = true : alertActive = false;
</script>


<div bind:clientWidth={innerWidth} class='w-auto h-max-content md:min-h-screen flex flex-col items-start'>
  {#if alertActive}
		<SelectedLockerAlert {selectedBuildingId} {selectedFloor} {selectedSectionId} {selectedLockerNum}
												 width={innerWidth} />
	{/if}
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
			{#if selectedSection && reservedLockers}
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