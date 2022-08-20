<script lang='ts'>
	import type { DepthData } from '$lib/types';
	import DepthExplorer from './DepthExplorer.svelte';
	import AddSquare from '../../icons/AddSquare.svelte';
	import SelectScreen from '../atom/SelectScreen.svelte';
	import DepartmentConfigSettings from './DepartmentConfigSettings.svelte';

	export let configs: Config[] = [];

	let depthData: DepthData[] = [
		{
			id: 'E',
			name: '전자정보공학부'
		},
		{
			id: 'A',
			name: 'AI융합학부'
		},
		{
			id: 'C',
			name: '컴퓨터학부'
		},
		{
			id: 'S',
			name: '소프트웨어학부'
		},
		{
			id: 'G',
			name: '글로벌미디어학부'
		},
		{
			id: 'add',
			name: '학부 추가...'
		}
	];
	let selections: string[] = [];

	$: selectedDepartmentConfig = selections[0] ? configs.find((v) => v.id === selections[0]) : undefined;
</script>

<section class='wrap'>
	<aside class='explorer'>
		<DepthExplorer rootText='학부 선택' breadcrumbClass='p-1' class='bg-white rounded-md overflow-hidden' data={depthData}
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
			<DepartmentConfigSettings original={selectedDepartmentConfig} isNew={selections[0] === 'add'} />
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