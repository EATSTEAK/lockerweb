<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Button from '../atom/Button.svelte';
	import Bookmark from '../../icons/Bookmark.svelte';
	import { config } from '$lib/store';
	import { getServiceConfig } from '$lib/api/config';

	export let width: number;

	export let selectedBuildingId: string;
	let selectedBuildingName: string;
	export let selectedFloor: number;
	export let selectedSection: string;
	export let selectedLockerNum: number;

	export let primaryClass: string = '';
	export let secondaryClass: string = '';
	export let isPrimaryBtnIconRight: boolean = false;
	export let isSecondaryBtnIconRight: boolean = false;

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

	let clazz = '';
	export { clazz as class };

	const dispatch = createEventDispatcher();

	function getBuildingName(serviceConfig: ServiceConfig) {
		return Object.entries(serviceConfig?.buildings).find(name => name[1]?.id === selectedBuildingId)?.[1].name;
	}

	function click(btnType: 'primary' | 'secondary') {
		if (btnType === 'primary') {
			dispatch('click', {});
		} else if (btnType === 'secondary') {
			dispatch('click:secondary', {});
		}
	}
</script>

<div transition:fly='{{ y: 10, duration: 150 }}' class='background flex flex-row justify-between px-2
 	fixed bottom-5 right-5
	rounded-xl z-50' style={`width:${width-42}px; background: rgba(80, 80, 80, 0.8);`}>
	<div class='flex flex-row gap-2 items-center px-1'>
		<h6 class='text-white bg-[#5F5F5F] rounded-lg py-1 px-2'>선택됨</h6>
		<h6 class='text-[#D5FFD4] italic font-semibold'>{getBuildingName(serviceConfig)}<span
			class='pl-2 not-italic'>|</span></h6>
		<h6 class='text-[#D5FFD4] italic font-semibold'>{selectedFloor}층<span class='pl-2 not-italic'>|</span></h6>
		<h6 class='text-[#D5FFD4] italic font-semibold'>{selectedSection}구역-{selectedLockerNum}</h6>
	</div>
	<div class='flex flex-row gap-2 items-center'>
		<Button on:click={() => click('secondary')}
						class='{secondaryClass} !py-2 !px-3 bg-[#EBEBEB] border-px border-[#CECECE] text-gray-600 text-center [&[disabled]]:opacity-50'>
			선택해제
		</Button>
		<Button on:click={() => click('primary')}
						class='{primaryClass} !py-2 !pl-2 my-2 bg-[#7088DF] text-white [&[disabled]]:opacity-50 !flex-none'
						isIconRight={isPrimaryBtnIconRight}>
			<Bookmark slot='icon' />
			예약하기
		</Button>
	</div>
</div>