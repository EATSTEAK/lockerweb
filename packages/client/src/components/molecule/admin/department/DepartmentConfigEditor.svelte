<script lang='ts'>
	import type { DepthData } from '$lib/types';
	import DepthExplorer from '../../DepthExplorer.svelte';
	import AddSquare from '../../../../icons/AddSquare.svelte';
	import SelectScreen from '../../../atom/SelectScreen.svelte';
	import DepartmentConfigSettings from './DepartmentConfigSettings.svelte';
	import { createEventDispatcher } from 'svelte';

	export let configs: DepartmentConfig[] = [];

	const dispatch = createEventDispatcher<{
		delete: ConfigDeleteRequest;
		update: DepartmentConfigUpdateRequest;
	}>();

	$: depthData = [
		...configs.map<DepthData>((department) => ({
			id: department.id,
			name: department.name
		})),
		{ id: 'add', name: '학부 추가' }
	];
	let selections: string[] = [];

	$: selectedDepartmentConfig =
		selections && selections[0] ? configs.find((v) => v.id === selections[0]) : undefined;
</script>

<section class='flex flex-col xl:flex-row flex-wrap gap-2'>
	<aside class='p-3 xl:w-1/4 rounded-md bg-gray-200 md:min-h-[540px]'>
		<DepthExplorer
			rootText='학부 선택'
			breadcrumbClass='p-1'
			class='bg-white rounded-md overflow-hidden'
			data={depthData}
			bind:selections
		>
			<button
				tabindex='0'
				slot='item'
				let:option
				let:selected
				class='my-1 w-full text-gray-700 flex justify-between p-2 bg-white cursor-pointer border-l-2 border-white transition-all outline-primary-800 outline-0 outline-none
									hover:brightness-90 hover:scale-101 active:brightness-75 active:scale-100 focus:brightness-75'
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
			<DepartmentConfigSettings
				on:delete
				on:update
				original={selectedDepartmentConfig}
				isNew={selections[0] === 'add'}
			/>
		{/if}
	</article>
</section>

<style>
    .selected {
        @apply border-primary-800 bg-gray-100 font-bold;
    }
</style>
