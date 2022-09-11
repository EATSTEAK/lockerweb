<script lang='ts'>
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

<div transition:fly='{{ y: 10, duration: 150 }}' class='background flex flex-row flex-wrap px-2
 	fixed bottom-5 right-5 backdrop-blur-sm
	rounded-xl z-50' style={`width:${width-42}px; background: rgba(80, 80, 80, 0.8);`}>
	<div class='flex flex-row flex-wrap gap-2 items-center px-1'>
		<h6 class='text-white bg-[#5F5F5F] rounded-lg my-2 py-1 px-2'>선택됨</h6>
		<div class='flex flex-row gap-1'>
			<h6 class='text-[#D5FFD4] italic font-semibold'>{getBuildingName(serviceConfig.buildings, buildingId)}<span
				class='pl-2 not-italic'>|</span></h6>
			<h6 class='text-[#D5FFD4] italic font-semibold'>{floor}층<span class='pl-2 not-italic'>|</span></h6>
			<h6 class='text-[#D5FFD4] italic font-semibold'>{sectionId}구역-{lockerNum}</h6>
		</div>

	</div>
	<div class='flex flex-row flex-end flex-grow justify-end gap-2 items-center mr-1'>
		<Button on:click={() => click('secondary')}
						class='{secondaryClass} !py-2 !px-3 bg-[#EBEBEB] border-px border-[#CECECE] text-gray-600 text-center [&[disabled]]:opacity-50'>
			선택 해제
		</Button>
		<Button on:click={() => click('primary')}
						class='{primaryClass} !py-2 !pl-2 my-2 bg-[#7088DF] text-white [&[disabled]]:opacity-50 !flex-none'>
			<Bookmark slot='icon' />
			예약하기
		</Button>
	</div>
</div>