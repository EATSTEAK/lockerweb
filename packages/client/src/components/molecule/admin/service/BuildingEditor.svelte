<script lang='ts'>
	import type { DepthData } from '$lib/types';
	import DepthExplorer from '../../DepthExplorer.svelte';
	import AddSquare from '../../../../icons/AddSquare.svelte';
	import SelectScreen from '../../../atom/SelectScreen.svelte';
	import BuildingSettings from './BuildingSettings.svelte';
	import SectionSettings from './SectionSettings.svelte';

	export let buildings: { [buildingNum: string]: Building } = {};

	let depthData: DepthData[] = [
		{
			id: '21',
			name: '정보과학관',
			children: [
				{
					id: '1-A',
					name: '1F 구역 A'
				},
				{
					id: '1-B',
					name: '1F 구역 B'
				},
				{
					id: '1-C',
					name: '1F 구역 C'
				},
				{
					id: 'add',
					name: '구역 추가...'
				}
			]
		},
		{
			id: 'add',
			name: '건물 추가...'
		}
	];
	let selections: string[] = [];

	$: selectedBuilding = buildings[selections[0]];
	$: selectedFloor = selections[1] && selections[1] !== 'add' ? selections[1].split('-')[0] : undefined;
	$: selectedSectionId = selections[1] && selections[1] !== 'add' ? selections[1].split('-')[1] : undefined;
	$: selectedSection = selectedFloor ? selectedBuilding.lockers[selectedFloor][selectedSectionId] : undefined;
</script>

<section class='wrap'>
	<aside class='explorer'>
		<DepthExplorer rootText='건물 선택' breadcrumbClass='p-1' class='bg-white rounded-md overflow-hidden' data={depthData}
									 bind:selections={selections}>
			<div slot='item' let:option let:selected class='depth-item' class:selected={selected}>
				{option.name}
				{#if option.id === 'add'}
					<AddSquare />
				{/if}
			</div>
		</DepthExplorer>
	</aside>
	<article class='edit'>
		{#if selections.length === 0}
			<SelectScreen />
		{:else if selections.length === 1}
			<BuildingSettings original={selectedBuilding} isNew={selections[0] === 'add'} />
		{:else if selections.length === 2}
			<SectionSettings floor={selectedFloor} originalId={selectedSectionId} original={selectedSection}
											 isNew={selections[1] === 'add'} />
		{/if}
	</article>
</section>


<style>
    .wrap {
        @apply flex flex-col xl:flex-row flex-wrap md:gap-2;
    }

    .explorer {
        @apply p-3 xl:w-1/4 rounded-md bg-gray-200;
    }

    .depth-item {
        @apply text-gray-700 flex justify-between p-2 bg-white cursor-pointer border-l-2 border-white transition-all;
    }

    .depth-item:hover {
        @apply brightness-90 scale-[1.01];
    }

    .selected {
        @apply border-primary-800 bg-gray-100 font-bold;
    }

    .edit {
        @apply grow rounded-md overflow-hidden;
    }
</style>