<!--suppress HtmlUnknownTag -->
<script lang='ts'>
	import { getDepartmentNameById } from '$lib/utils';
	import { config } from '$lib/store';
	import Edit from '../../../../icons/Edit.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import Checkbox from '../../../atom/form/Checkbox.svelte';
	import { fly } from 'svelte/transition';
	import Pagination from '../../../atom/Pagination.svelte';
	import BookmarkOff from '../../../../icons/BookmarkOff.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import Search from '../../../../icons/Search.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		edit: User,
		batchDelete: {}
		batchUnclaim: {}
	}>();

	export let users: Array<User>;

	let filter: string = '';

	let currentPage = 0;
	let itemsPerPage = 25;
	let selectAll = false;
	export let selected = [];
	let batchActionOut = true;

	$: filteredUsers = users ? getFilteredUsers(filter, users) : [];

	$: shownUsers = users ? getShownUsers(currentPage, itemsPerPage, filteredUsers) : [];

	$: if (itemsPerPage && filteredUsers) {
		if (currentPage * itemsPerPage > filteredUsers.length) currentPage = 0;
	}

	$: if (selected.every(id => shownUsers.includes(id))) {
		selected = [];
	}

	$: if (selectAll) {
		selected = [...shownUsers.map(user => user.id)];
	} else if (selectAll === false) {
		selected = [];
	}

	$: if (selected.length >= 0) updateSelectAll();

	function editUser(user: User) {
		dispatch('edit', user);
	}

	function updateSelectAll() {
		if (shownUsers.length && selected.length === shownUsers.length && !selectAll) {
			selectAll = true;
		} else if (!shownUsers.length || (selected.length < shownUsers.length && selectAll)) {
			selectAll = false;
		}
	}

	function selectionChange(id: string, checked: boolean) {
		if (checked && !selected.includes(id)) {
			selected = [...selected, id];
		} else if (!checked) {
			selected = selected.filter(idInside => idInside !== id);
		}
	}

	function getFilteredUsers(filter: string, users: User[]) {
		if (!filter) users;
		return users.filter(user => user.id.includes(filter) || user.name.includes(filter) || (user.lockerId && user.lockerId.includes(filter)));
	}

	function getShownUsers(currentPage: number, itemsPerPage: number, users: Array<User>) {
		const start = currentPage * itemsPerPage;
		return users.slice(start, start + itemsPerPage);
	}
</script>
<div class='flex flex-col h-full'>
	{#if selected.length}
		<div in:fly={{ y: 10, duration: 100 }} out:fly={{ y: 10, duration: 100 }}
				 on:outrostart={() => batchActionOut = false}
				 on:outroend={() => batchActionOut = true} class='rounded-t-md bg-primary-800 text-white leading-6 py-2 px-3 border border-transparent flex justify-between'>
			<div class='selections-text'>{selected.length}개 선택됨</div>
			<div class='flex -m-2'>
				<button on:click={() => dispatch('batchUnclaim', {})} class='rounded-xl bg-primary-800 flex gap-1 p-2 hover:brightness-90 active:brightness-75'>
					<BookmarkOff />
					예약 일괄 취소
				</button>
				<button on:click={() => dispatch('batchDelete', {})} class='rounded-xl bg-primary-800 flex gap-1 p-2 hover:brightness-90 active:brightness-75'>
					<Delete />
					삭제
				</button>
			</div>
		</div>
	{:else if batchActionOut}
		<div class='rounded-t-md bg-gray-100 flex w-full'>
			<div class='flex w-full'>
				<div class='flex justify-center items-center px-2 text-gray-500'>
					<Search class='w-6 h-6' />
				</div>
				<TextInput id='search' label='검색' class='grow' bind:value={filter} placeholder='검색하기...' />
			</div>
		</div>
	{/if}
	<div class='grow'>
		<table>
			<thead>
			<th class='w-6'>
				<div class='flex justify-center items-center'>
					<Checkbox id='select_all' bind:checked={selectAll} />
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
			{#if shownUsers}
				{#each shownUsers as user}
					<tr>
						<td>
							<div class='flex justify-center items-center'>
								<Checkbox id={`${user.id}`} checked={selected.includes(user.id)}
													on:change={(evt) => { selectionChange(user.id, evt.target.checked) }} />
							</div>
						</td>
						<td>{getDepartmentNameById($config?.result ?? [], user.department) ?? '알 수 없음'}</td>
						<td>{user.id}</td>
						<td>{user.name}</td>
						<td>
							<div class='flex justify-center items-center'>
								<Checkbox id={`${user.id}_isAdmin`} checked={user.isAdmin} disabled />
							</div>
						</td>
						<td>
							{user.lockerId ? user.lockerId : '없음'}
						</td>
						<td>
							<button
								on:click={() => editUser(user)}
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
	<Pagination totalEntries={filteredUsers.length} bind:currentPage bind:itemsPerPage />
</div>


<style>
		table {
        @apply table-auto min-w-[560px] w-full;
    }

    thead {
        @apply relative bg-gray-100;
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
</style>