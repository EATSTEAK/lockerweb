<script lang="ts">
  import Select from './form/Select.svelte';
  import CaretLeft from '../../icons/CaretLeft.svelte';
  import CaretRight from '../../icons/CaretRight.svelte';

  export let totalEntries: number = 0;
  export let currentPage: number = 0;
  export let itemsPerPage: number = 25;

  let itemsPerPageStr = `${itemsPerPage}`;

  $: if (itemsPerPageStr) itemsPerPage = parseInt(itemsPerPageStr);

  $: totalPage = totalEntries / itemsPerPage;

  function prevPage() {
    currentPage = currentPage - 1;
  }

  function nextPage() {
    currentPage = currentPage + 1;
  }
</script>

<div class="flex w-full items-center gap-3">
  <div class="flex items-center gap-1">
    <p class="font-bold">페이지 별 항목 수:</p>
    <Select bind:value={itemsPerPageStr} id="items-per-page" label="페이지 별 항목 수">
      <option id="25">25</option>
      <option id="50">50</option>
      <option id="100">100</option>
      <option id="200">200</option>
      <option id="500">500</option>
    </Select>
  </div>
  <div class="grow">
    항목 <span class="font-bold">{totalEntries}</span> 중
    <span class="font-bold"
      >{itemsPerPage * currentPage + 1 > totalEntries
        ? totalEntries
        : itemsPerPage * currentPage + 1}</span
    >-<span class="font-bold"
      >{itemsPerPage * (currentPage + 1) >= totalEntries
        ? totalEntries
        : itemsPerPage * (currentPage + 1)}</span
    >
  </div>
  <div class="flex items-center gap-1">
    <button
      on:click={prevPage}
      class="pagination-btn rounded-md bg-gray-200 p-1 text-gray-500 transition-all"
      disabled={currentPage < 1}
    >
      <CaretLeft />
    </button>
    <div class="px-2">{currentPage + 1}</div>
    <button
      on:click={nextPage}
      class="pagination-btn rounded-md bg-gray-200 p-1 text-gray-500 transition-all"
      disabled={currentPage + 1 >= totalPage}
    >
      <CaretRight />
    </button>
  </div>
</div>

<style lang="postcss">
  .pagination-btn:not(:disabled):hover {
    @apply scale-101 brightness-90;
  }

  .pagination-btn:not(:disabled):focus {
    @apply scale-100 brightness-90;
  }

  .pagination-btn:not(:disabled):active {
    @apply scale-100 brightness-75;
  }

  .pagination-btn:disabled {
    @apply opacity-50;
  }
</style>
