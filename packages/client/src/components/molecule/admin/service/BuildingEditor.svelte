<script lang='ts'>
	import type {
		BuildingRemoveRequest,
		BuildingUpdateRequest,
		DepthData,
		SectionRemoveRequest,
		SectionUpdateRequest
	} from '$lib/types';
	import DepthExplorer from '../../DepthExplorer.svelte';
	import AddSquare from '../../../../icons/AddSquare.svelte';
	import SelectScreen from '../../../atom/SelectScreen.svelte';
	import BuildingSettings from './BuildingSettings.svelte';
	import SectionSettings from './SectionSettings.svelte';

	export let buildings: { [buildingNum: string]: Building } = {};

	function formatFloor(floor: string) {
		return floor.length < 2 ? `${floor}F` : floor;
	}

	let selections: string[] = [];
	let depthData = constructDepthData(buildings);

	$: selectedBuilding = buildings[selections[0]];
	$: selectedFloor =
		selections[1] && selections[1] !== 'add' ? selections[1].split('-')[0] : undefined;
	$: selectedSectionId =
		selections[1] && selections[1] !== 'add' ? selections[1].split('-')[1] : undefined;
	$: selectedSection = selectedFloor
		? selectedBuilding.lockers[selectedFloor]?.[selectedSectionId]
		: undefined;

	$: if (buildings) {
		depthData = constructDepthData(buildings);
	}

	function constructDepthData(buildings: { [buildingNum: string]: Building }): DepthData[] {
		if (selections.length) {
			if (selections[0] !== 'add' && !buildings[selections[0]]) selections = [];
			if (selections[1] && selections[1] !== 'add') {
				const [floor, id] = selections[1].split('-');
				const sect = buildings[selections[0]];
				if (!sect[floor]?.[id]) selections = [];
			}
		}
		return [
			...Object.entries(buildings).map<DepthData>(([buildingNum, building]) => ({
				id: buildingNum,
				name: building.name,
				children: [
					...Object.entries(building.lockers).flatMap<DepthData>(([floor, sections]) =>
						Object.keys(sections).map<DepthData>((sectionId) => ({
							id: `${floor}-${sectionId}`,
							name: `${formatFloor(floor ?? '')} 구역 ${sectionId}`
						}))
					),
					{ id: 'add', name: '구역 추가...' }
				]
			})),
			{ id: 'add', name: '건물 추가...' }
		];
	}

	function buildingUpdate(evt: CustomEvent<BuildingUpdateRequest>) {
		if (!buildings[evt.detail.id]) {
			buildings[evt.detail.id] = {
				id: evt.detail.id,
				name: evt.detail.name,
				lockers: {}
			};
			selections = [evt.detail.id];
			return;
		}
		buildings[evt.detail.id].name = evt.detail.name;
		buildings = { ...buildings };
	}

	function buildingRemove(evt: CustomEvent<BuildingRemoveRequest>) {
		delete buildings[evt.detail.id];
		buildings = { ...buildings };
		if (selections[0] === evt.detail.id) selections = [];
	}

	function sectionUpdate(evt: CustomEvent<SectionUpdateRequest>) {
		const { floor, id, height, disabled, subsections } = evt.detail;
		if (!buildings[selections[0]].lockers) buildings[selections[0]].lockers = {};
		if (!buildings[selections[0]].lockers[floor]) buildings[selections[0]].lockers[floor] = {};
		buildings[selections[0]].lockers[floor][id] = {
			subsections,
			height,
			disabled
		};
		buildings = { ...buildings };
	}

	function sectionRemove(evt: CustomEvent<SectionRemoveRequest>) {
		const { floor, id } = evt.detail;
		delete buildings[selections[0]].lockers[floor][id];
		if (Object.keys(buildings[selections[0]].lockers[floor]).length === 0)
			delete buildings[selections[0]].lockers[floor];
		buildings = { ...buildings };
	}
</script>

<section class='flex flex-col xl:flex-row flex-wrap gap-2'>
	<aside class='p-3 xl:w-1/4 rounded-md bg-gray-200 md:min-h-[540px]'>
		<DepthExplorer
			rootText='건물 선택'
			breadcrumbClass='p-1'
			class='bg-white rounded-md max-h-[480px] overflow-x-hidden overflow-y-scroll'
			data={depthData}
			bind:selections
		>
			<button
				tabindex='0'
				slot='item'
				let:option
				let:selected
				class='my-1 w-full text-gray-700 flex justify-between
							p-2 bg-white cursor-pointer border-l-2 border-white transition-all
							outline-primary-800 outline-0 outline-none
							hover:brightness-90 hover:scale-[1.01]
							active:brightness-75 active:scale-100
							focus:brightness-75'
				class:selected
			>
				{option.name}
				{#if option.id === 'add'}
					<AddSquare />
				{/if}
			</button>
		</DepthExplorer>
	</aside>
	<article class='grow rounded-md overflow-hidden'>
		{#if selections.length === 0}
			<SelectScreen class='min-h-[540px]' />
		{:else if selections.length === 1}
			<BuildingSettings
				on:update={buildingUpdate}
				on:remove={buildingRemove}
				original={selectedBuilding}
				isNew={selections[0] === 'add'}
			/>
		{:else if selections.length === 2}
			<SectionSettings
				on:update={sectionUpdate}
				on:remove={sectionRemove}
				floor={selectedFloor}
				originalId={selectedSectionId}
				original={selectedSection}
				isNew={selections[1] === 'add'}
			/>
		{/if}
	</article>
</section>

<style>
    .selected {
        @apply border-primary-800 bg-gray-100 font-bold;
    }
</style>
