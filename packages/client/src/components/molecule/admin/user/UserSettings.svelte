<script lang='ts'>
	import UserDatatable from './UserDatatable.svelte';
	import Button from '../../../atom/Button.svelte';
	import Add from '../../../../icons/Add.svelte';
	import DocumentTable from '../../../../icons/DocumentTable.svelte';
	import TabGroup from '../../../atom/TabGroup.svelte';
	import TabItem from '../../../atom/TabItem.svelte';
	import { config } from '$lib/store';

	export let users: Array<User>;

	$: departments = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];

	let selectedTab;

	$: departmentUsers = selectedTab ? getUsersByDepartment(selectedTab, users) : [];

	function getUsersByDepartment(department: string, users: Array<User>) {
		if (departments.map(dept => dept.id).includes(department)) {
			return users.filter(user => user.department === department);
		}
		return users.filter(user => !departments.map(dept => dept.id).includes(user.department));
	}
</script>

<div class='wrap'>
	<div class='title'>
		<h3>사용자 설정</h3>
		<div class='user-control'>
			<Button class='bg-primary-800 text-white' isIconRight>
				사용자 추가
				<Add slot='icon' />
			</Button>
			<Button class='bg-green-800 text-white' isIconRight>
				XLSX로 내보내기
				<DocumentTable slot='icon' />
			</Button>
		</div>
	</div>
	<div class='card table'>
		<TabGroup bind:selectedId={selectedTab}>
			{#each departments as department}
				<TabItem id={department.id}>{department.name}</TabItem>
			{/each}
			<!-- 존재하지 않는 학부를 가진 사용자가 있을 경우 -->
			{#if users.filter(user => !departments.map(dept => dept.id).includes(user.department)).length}
				<TabItem id='unknown'>알 수 없음</TabItem>
			{/if}
		</TabGroup>
		<UserDatatable users={departmentUsers} />
	</div>
</div>

<style>
    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3 w-auto items-stretch;
    }

    .title {
        @apply mx-6 md:mx-0 flex flex-wrap w-full;
    }

    .user-control {
        @apply grow flex justify-end items-center gap-1;
    }

    .card {
        @apply md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3;
    }

    .table {
        @apply basis-[640px] min-w-[640px];
    }
</style>