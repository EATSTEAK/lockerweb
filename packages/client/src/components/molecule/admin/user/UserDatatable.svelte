<script lang='ts'>
	import { getDepartmentNameById } from '$lib/utils';
	import { config } from '$lib/store';
	import Edit from '../../../../icons/Edit.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import Checkbox from '../../../atom/form/Checkbox.svelte';
	import Button from '../../../atom/Button.svelte';
	import Search from '../../../../icons/Search.svelte';
	import Pagination from '../../../atom/Pagination.svelte';

	export let users: Array<User>;

	let currentPage = 0;
</script>
<div class='wrap'>
	<div class='actions'>
		<div class='search'>
			<TextInput class='grow' value='' placeholder='검색하기...' />
			<Button class='bg-primary-800 text-white' style='box-shadow: none; padding: 0 1em;' isIconRight>
				검색
				<Search slot='icon' />
			</Button>
		</div>
	</div>
	<div class='table-wrap'>
		<table>
			<thead>
			<th class='w-6'>
				<div class='checkbox-cell'>
					<Checkbox />
				</div>
			</th>
			<th data-key='department'>학부</th>
			<th data-key='id'>학번</th>
			<th data-key='name'>이름</th>
			<th class='w-16' data-key='isAdmin'>관리자</th>
			<th data-key='lockerId'>대여한 사물함</th>
			<th class='w-2'></th>
			</thead>
			<tbody>
			{#if users}
				{#each users as user}
					<tr>
						<td>
							<div class='checkbox-cell'>
								<Checkbox />
							</div>
						</td>
						<td>{getDepartmentNameById($config, user.department)}</td>
						<td>{user.id}</td>
						<td>{user.name}</td>
						<td>
							<div class='checkbox-cell'>
								<Checkbox disabled checked={user.isAdmin} />
							</div>
						</td>
						<td>
							{user.lockerId ? user.lockerId : '없음'}
						</td>
						<td>
							<button
								class='bg-gray-100 p-2 rounded-md hover:brightness-90 active:brightness-75 focus:brightness-75 focus:outline-0'>
								<Edit class='w-4 h-4' slot='icon' />
							</button>
						</td>
					</tr>
				{/each}
			{/if}
			</tbody>
		</table>
	</div>
	<Pagination totalEntries={users.length} bind:currentPage />
</div>


<style>
    .wrap {
        @apply flex flex-col h-full;
    }

    .table-wrap {
        @apply grow;
    }

    table {
        @apply table-auto min-w-[560px] w-full;
    }

    thead {
        @apply relative bg-gray-100;
    }

    .actions {
        @apply rounded-t-md bg-gray-100 flex w-full;
    }

    .search {
        @apply flex w-full;
    }

    th, td {
        @apply border-slate-200 border-b text-left py-3 px-2;
    }

    tr {
        @apply transition-all bg-white;
    }

    tr:nth-child(2n) {
        @apply bg-gray-100;
    }

    tr:hover {
        @apply brightness-90;
    }

    .checkbox-cell {
        @apply flex justify-center items-center;
    }
</style>