<script lang='ts'>
	import Select from './form/Select.svelte';
	import CaretLeft from '../../icons/CaretLeft.svelte';
	import CaretRight from '../../icons/CaretRight.svelte';

	export let totalEntries: number;
	export let currentPage: number = 0;
	export let itemsPerPage: number = 25;

	$: totalPage = totalEntries / itemsPerPage;
</script>

<div class='wrap'>
	<div class='item-per-page-wrap'>
		<p class='font-bold'>페이지 별 항목 수:</p>
		<Select id='items-per-page' label='페이지 별 항목 수'>
			<option id='25'>25</option>
			<option id='50'>50</option>
			<option id='100'>100</option>
			<option id='200'>200</option>
			<option id='500'>500</option>
		</Select>
	</div>
	<div class='current-page'>항목 <span class='font-bold'>{totalEntries}</span> 중 <span
		class='font-bold'>{itemsPerPage * currentPage + 1}</span>-<span
		class='font-bold'>{itemsPerPage * (currentPage + 1) >= totalEntries ? totalEntries : itemsPerPage * (currentPage + 1)}</span>
	</div>
	<div class='pagination'>
		<button class='pagination-btn' disabled={currentPage < 1}>
			<CaretLeft />
		</button>
		<div class='page-indicator'>{currentPage + 1}</div>
		<button class='pagination-btn' disabled={currentPage + 1 >= totalPage}>
			<CaretRight />
		</button>
	</div>
</div>

<style>
    .wrap {
        @apply flex w-full items-center gap-3;
    }

    .item-per-page-wrap {
        @apply flex gap-1 items-center;
    }

    .current-page {
        @apply grow;
    }

    .pagination {
        @apply flex gap-1 items-center;
    }

    .page-indicator {
        @apply px-2;

    }

    .pagination-btn {
        @apply transition-all bg-gray-200 p-1 text-gray-500 rounded-md;
    }

    .pagination-btn:not(:disabled):hover {
        @apply brightness-90 scale-[1.01];
    }

    .pagination-btn:not(:disabled):focus {
        @apply brightness-90 scale-100;
    }

    .pagination-btn:not(:disabled):active {
        @apply brightness-75 scale-100;
    }

    .pagination-btn:disabled {
        @apply bg-gray-100 text-gray-300;
    }
</style>