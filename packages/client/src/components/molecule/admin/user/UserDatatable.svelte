<script lang='ts'>
	import { Datatable } from 'svelte-simple-datatables';
	import { getDepartmentNameById } from '$lib/utils';
	import { config } from '$lib/store';
	import Button from '../../../atom/Button.svelte';

	const settings = {
		sortable: true,
		pagination: true,
		rowsPerPage: 50,
		columnFilter: true,
		labels: {
			search: '검색하기...',
			filter: '필터',
			noRows: '보여줄 열이 없습니다.',
			info: '항목 {rows} 중 {start}-{end}',
			previous: '이전',
			next: '다음'
		}
	};

	export let users: Array<User>;

	let rows;
</script>

<Datatable {settings} data={users} bind:dataRows={rows}>
	<thead>
	<th class='w-1'>선택</th>
	<th data-key='department'>학부</th>
	<th data-key='id'>학번</th>
	<th data-key='name'>이름</th>
	<th data-key='isAdmin'>관리자 여부</th>
	<th data-key='lockerId'>대여한 사물함</th>
	<th class='w-2'>작업</th>
	</thead>
	<tbody>
	{#if rows}
		{#each $rows as row}
			<tr>
				<td><input type='checkbox' /></td>
				<td>{getDepartmentNameById($config, row.department)}</td>
				<td>{row.id}</td>
				<td>{row.name}</td>
				<td>{row.isAdmin}</td>
				<td>
					{row.lockerId ? row.lockerId : '없음'}
				</td>
				<td>
					<Button>수정</Button>
				</td>
			</tr>
		{/each}
	{/if}
	</tbody>
</Datatable>