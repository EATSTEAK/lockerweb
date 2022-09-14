<script lang="ts">
  import type { DepthData } from '$lib/types';
  import DepthExplorer from '../../DepthExplorer.svelte';
  import AddSquare from '../../../../icons/AddSquare.svelte';
  import SelectScreen from '../../../atom/SelectScreen.svelte';
  import DepartmentConfigSettings from './DepartmentConfigSettings.svelte';

  export let configs: DepartmentConfig[] = [];

  $: depthData = [
    ...configs.map<DepthData>((department) => ({
      id: department.id,
      name: department.name,
    })),
    { id: 'add', name: '학과(부) 추가' },
  ];
  let selections: string[] = [];

  $: selectedDepartmentConfig =
    selections && selections[0] ? configs.find((v) => v.id === selections[0]) : undefined;
</script>

<section class="flex flex-col flex-wrap gap-2 xl:flex-row">
  <aside class="rounded-md bg-gray-200 p-3 lg:min-h-[540px] xl:w-1/4">
    <DepthExplorer
      rootText="학과(부) 선택"
      breadcrumbClass="p-1"
      class="overflow-hidden rounded-md bg-white"
      data={depthData}
      bind:selections>
      <button
        tabindex="0"
        slot="item"
        let:option
        let:selected
        class="my-1 flex w-full cursor-pointer justify-between border-l-2 border-white bg-white p-2 text-gray-700 outline-none outline-0 outline-primary-800 transition-all
									hover:scale-101 hover:brightness-90 focus:brightness-75 active:scale-100 active:brightness-75"
        class:selected>
        {option.name}
        {#if option.id === 'add'}
          <AddSquare />
        {/if}
      </button>
    </DepthExplorer>
  </aside>
  <article class="grow overflow-hidden rounded-md">
    {#if selections.length === 0}
      <SelectScreen class="min-h-[540px]" />
    {:else if selections.length === 1}
      <DepartmentConfigSettings
        on:delete
        on:update
        original={selectedDepartmentConfig}
        isNew={selections[0] === 'add'} />
    {/if}
  </article>
</section>

<style lang="postcss">
  .selected {
    @apply border-primary-800 bg-gray-100 font-bold;
  }
</style>
