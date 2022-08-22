<script lang='ts'>
	import UserDatatable from './UserDatatable.svelte';
	import Button from '../../../atom/Button.svelte';
	import Add from '../../../../icons/Add.svelte';
	import DocumentTable from '../../../../icons/DocumentTable.svelte';
	import TabGroup from '../../../atom/TabGroup.svelte';
	import TabItem from '../../../atom/TabItem.svelte';

	export let users: Array<User>;

	let selectedTab;
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
			<TabItem id='G' selected>글로벌미디어학부</TabItem>
			<TabItem id='E'>전자정보공학부</TabItem>
			<TabItem id='A'>AI융합학부</TabItem>
			<TabItem id='C'>컴퓨터학부</TabItem>
			<TabItem id='S'>소프트웨어학부</TabItem>
		</TabGroup>
		<UserDatatable {users} />
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