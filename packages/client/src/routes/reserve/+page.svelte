<script lang='ts'>
	import NavigationShell from '../../components/molecule/NavigationShell.svelte';
	import Button from '../../components/atom/Button.svelte';
	import UserReservedLocker from '../../components/molecule/reserve/UserReservedLocker.svelte';
	import LockerReserveInfo from '../../components/molecule/reserve/LockerReserveInfo.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';
	import { config, user } from '$lib/store';
	import { getServiceConfig } from '$lib/api/config';
	import { browser } from '$app/env';
	import { deleteAuthorization, getAuthorization } from '$lib/auth';
	import Settings from '../../icons/Settings.svelte';
	import Credit from '../../components/molecule/Credit.svelte';
	import Modal from '../../components/molecule/Modal.svelte';
	import Dismiss from '../../icons/Dismiss.svelte';
	import Skeleton from '../../components/atom/Skeleton.svelte';

	let innerWidth: number = 0;

	let reservedLocker: ReservedLocker;
	let targetDepartmentId: string;
	let contactModalOpen = false;

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

	$:if ($user && $user.success) {
		reservedLocker = getUserReservedLocker($user.result);
		targetDepartmentId = $user.result.department;
	} else {
		reservedLocker = undefined;
	}

	if (browser && !getAuthorization()) {
		deleteSessionAndGoIndex();
	}

	// 사용자의 세션이 잘못되었을 경우, 세션 삭제 후 메인 페이지로 이동
	$: if ($user && $user.success === false && browser) {
		const error = $user.error;
		if (error.code === 401 || error.code === 403 || error.code === 404) {
			deleteSessionAndGoIndex();
		}
	}

	function deleteSessionAndGoIndex() {
		deleteAuthorization();
		window.location.href = '/';
	}

	function getUserReservedLocker(userInfo: User): ReservedLocker {
		if (userInfo?.lockerId) {
			return {
				lockerId: userInfo.lockerId,
				...(userInfo.claimedUntil && { claimedUntil: userInfo.claimedUntil as Date })
			};
		}
		return null;
	}
</script>

<PageTitle name='예약하기' />

<svelte:window bind:innerWidth />

<NavigationShell collapsable={innerWidth && innerWidth <= 768}>
	<div class='w-full h-full' slot='navigation_content'>
		<UserReservedLocker {reservedLocker} />
		{#if $config && $config.success}
			<Button on:click={() => contactModalOpen = true}
							class='px-0 py-0 !shadow-none text-primary-800 underline hover:!shadow-none hover:text-primary-900 active:!shadow-none active:drop-shadow-md'>
				도움이 필요하신가요?
			</Button>
		{:else}
			<Skeleton class='w-36 h-6 mt-2 bg-gray-300 rounded-lg'></Skeleton>
		{/if}
	</div>
	<div class='flex flex-col w-full gap-2' slot='navigation_footer'>
		<div class='flex flex-row justify-between items-center w-full'>
			<Button class='bg-primary-800 text-white' isIconRight href='/logout'>
				<ArrowExportLtr slot='icon' />
				로그아웃
			</Button>
			{#if $user && $user.success && $user.result.isAdmin}
				<Button class='bg-red-200 text-gray-800' isIconRight href='/admin'>
					서비스 관리
					<Settings slot='icon' />
				</Button>
			{:else}
				<Credit />
			{/if}
		</div>
	</div>
	<div class='grow'>
		<LockerReserveInfo {targetDepartmentId} {serviceConfig} />
	</div>

</NavigationShell>

<Modal title='학과(부) 연락처' bind:open={contactModalOpen} secondaryClass='hidden' primaryText='닫기'
			 on:close={() => contactModalOpen = false}
			 on:click={() => contactModalOpen = false}>
	{#each (($config && $config.success) ? $config.result : []) as config}
		{#if config.contact}
			<div class='my-2 leading-10'>
				<h5>{config.name} 연락처</h5>
				<p class='text-gray-700'>{config.contact}</p>
			</div>
		{/if}
	{:else}
		입력된 연락처가 없습니다.
	{/each}
	<Dismiss slot='primaryIcon' />
</Modal>