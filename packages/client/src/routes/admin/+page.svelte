<script lang='ts'>
	import Soongsil from '../../icons/Soongsil.svelte';
	import Button from '../../components/atom/Button.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import MailInbox from '../../icons/MailInbox.svelte';
	import Profile from '../../components/molecule/Profile.svelte';
	import SelectionListItemGroup from '../../components/atom/SelectionListItemGroup.svelte';
	import SelectionListItem from '../../components/atom/SelectionListItem.svelte';
	import UserSettings from '../../components/molecule/admin/user/UserSettings.svelte';
	import ServiceSettings from '../../components/molecule/admin/service/ServiceSettings.svelte';
	import { user } from '$lib/store';
	import DepartmentSettings from '../../components/molecule/admin/department/DepartmentSettings.svelte';
	import PeopleSettings from '../../icons/PeopleSettings.svelte';
	import Settings from '../../icons/Settings.svelte';
	import ContentSettings from '../../icons/ContentSettings.svelte';
	import { browser } from '$app/env';
	import { deleteAuthorization, fetchWithAuth } from '$lib/auth';
	import { variables } from '$lib/variables';
	import LoadingScreen from '../../components/atom/LoadingScreen.svelte';
	import ErrorScreen from '../../components/atom/ErrorScreen.svelte';
	import Skeleton from '../../components/atom/Skeleton.svelte';


	let selectedTab;

	let userUpdating = false;
	let userRequestError = null;

	let userPromise: Promise<Array<User>>;
	if (browser) {
		queryUser();
	}

	// 사용자의 세션이 잘못되었을 경우, 세션 삭제 후 메인 페이지로 이동
	$: if ($user === null && browser) {
		deleteAuthorization();
		window.location.href = '/';
	}

	function queryUser() {
		userPromise = fetchWithAuth(variables.baseUrl + '/api/v1/user/query').then((res) => res.json())
			.then((res) => {
				if (res.success) {
					return res.result;
				}
				throw new Error(res.errorDescription);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function updateUser(evt: CustomEvent<UserUpdateRequest>) {
		userUpdating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/user/update', {
			method: 'POST',
			body: JSON.stringify(evt.detail)
		}).then(res => res.json())
			.then(res => {
				userUpdating = false;
				if (res.success) {
					queryUser();
				} else {
					userRequestError = res.errorDescription;
				}
			})
			.catch(err => {
				userUpdating = false;
				userRequestError = err;
			});
	}

	function batchPutUser(evt: CustomEvent<User[]>) {
		userUpdating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/user/batch/put', {
			method: 'POST',
			body: JSON.stringify(evt.detail)
		}).then(res => res.json())
			.then(res => {
				userUpdating = false;
				if (res.success) {
					queryUser();
				} else {
					userRequestError = res.errorDescription;
				}
			})
			.catch(err => {
				userUpdating = false;
				userRequestError = err;
			});
	}

	function batchDeleteUser(evt: CustomEvent<string[]>) {
		userUpdating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/user/batch/delete', {
			method: 'POST',
			body: JSON.stringify(evt.detail)
		}).then(res => res.json())
			.then(res => {
				userUpdating = false;
				if (res.success) {
					queryUser();
				} else {
					userRequestError = res.errorDescription;
				}
			})
			.catch(err => {
				userUpdating = false;
				userRequestError = err;
			});
	}
</script>

<div class='root'>
	<div class='side-wrap'>
		<div class='logo'>
			<Soongsil class='w-20 h-20' />
		</div>
		<div class='content'>
			<div class='flex flex-col gap-4'>
				<Profile user={$user} />
				<hr />
			</div>
			<div class='flex flex-col gap-3'>
				{#if $user}
					<h3>설정</h3>
					<SelectionListItemGroup bind:selectedId={selectedTab}>
						<SelectionListItem class='flex justify-between items-center' id='user'>
							<span>사용자 설정</span>
							<PeopleSettings />
						</SelectionListItem>
						<SelectionListItem class='flex justify-between items-center' id='service'>
							<span>서비스 설정</span>
							<Settings />
						</SelectionListItem>
						<SelectionListItem class='flex justify-between items-center' id='department'>
							<span>학부별 설정</span>
							<ContentSettings />
						</SelectionListItem>
					</SelectionListItemGroup>
				{:else if $user === undefined}
					<Skeleton class='w-32 h-12 bg-gray-300 rounded-lg' />
					<Skeleton class='w-72 h-36 bg-gray-300 rounded-xl' />
				{/if}
			</div>
		</div>
		<div class='footer'>
			<Button class='bg-primary-900 text-white' isIconRight={true}>
				<ArrowExportLtr slot='icon' />
				로그아웃
			</Button>
			<Button class='bg-green-200 text-black' isIconRight={true} href='/reserve'>
				<MailInbox slot='icon' />
				예약 페이지로
			</Button>
		</div>
	</div>
	<div class='dashboard'>
		{#if $user && (!$user.department || $user.isAdmin)}
			{#if selectedTab === "user"}
				{#await userPromise}
					<div class='user-screen-wrap'>
						<div class='title'>
							<h3>사용자 설정</h3>
						</div>
						<LoadingScreen class='min-h-[32rem] md:rounded-md' />
					</div>
				{:then users}
					<UserSettings on:user:update={updateUser} on:user:batchPut={batchPutUser}
												on:user:batchDelete={batchDeleteUser}
												updating={userUpdating} error={userRequestError} {users} />
				{:catch err}
					<div class='user-screen-wrap'>
						<div class='title'>
							<h3>사용자 설정</h3>
						</div>
						<ErrorScreen class='min-h-[32rem] md:rounded-md' />
					</div>
				{/await}
			{:else if selectedTab === "service"}
				<ServiceSettings />
			{:else if selectedTab === "department"}
				<DepartmentSettings />
			{/if}
		{:else if !$user}
			<LoadingScreen class='min-h-[480px]' />
		{:else}
			<ErrorScreen class='min-h-[480px]' errorMessage='권한이 부족하여 접근하실 수 없습니다.' />
		{/if}
	</div>
</div>

<style>
    .root {
        @apply flex flex-col md:flex-row items-stretch;
    }

    .side-wrap {
        @apply bg-gray-200 w-full md:min-w-[380px] md:w-[380px] flex flex-col justify-between min-h-screen px-10;
    }

    .content {
        @apply flex flex-col justify-evenly grow;
    }

    hr {
        @apply h-0.5 mx-8 bg-gray-400;
    }

    .dashboard {
        @apply grow h-screen md:overflow-y-scroll bg-gray-100;
    }

    .user-screen-wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3 w-auto items-stretch;
    }

    .user-screen-wrap .title {
        @apply mx-6 md:mx-0 flex flex-wrap w-full;
    }

    .logo {
        @apply pt-8;
    }

    .footer {
        @apply pb-4 flex flex-wrap justify-between;
    }
</style>