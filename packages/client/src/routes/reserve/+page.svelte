<script lang='ts'>
	import NavigationShell from '../../components/molecule/NavigationShell.svelte';
	import Button from '../../components/atom/Button.svelte';
	import UserReservedLocker from '../../components/molecule/reserve/UserReservedLocker.svelte';
	import LockerReserveInfo from '../../components/molecule/reserve/LockerReserveInfo.svelte';
	import Skeleton from '../../components/atom/Skeleton.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';
	import { config, user } from '$lib/store';
	import { getServiceConfig } from '$lib/api/config';


	let fetchStatus: boolean = false;

	let innerWidth: number = 0;

	let reservedLocker: ReservedLocker;
	let lockerSection: string;
	let lockerNumber: number;
	let contact: string;
	let targetDepartmentId: string;
	let contactDepartment: string;

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

	$:if ($user && $user.success) {
		reservedLocker = getUserReservedLocker($user.result);
		if ($config && $config.success) {
			loadContact($user.result, $config.result);
		}
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

	function loadContact(userInfo: User, config: Array<Config>) {
		if (userInfo?.department) {
			const isDepartmentSame = config.find(config => config.id === userInfo.department);
			targetDepartmentId = userInfo.department;
			contact = isDepartmentSame.contact;
			contactDepartment = isDepartmentSame.name;
		}
	}
</script>

<PageTitle name='예약하기' />

<svelte:window bind:innerWidth />

<NavigationShell collapsable={innerWidth && innerWidth <= 768}>
	<div class='w-full h-96' slot='navigation_content'>
		<UserReservedLocker {reservedLocker} />
	</div>
	<div class='flex justify-between items-center w-full' slot='navigation_footer'>
		<Button class='bg-primary-800 text-white' isIconRight={true} href='/logout'>
			<ArrowExportLtr slot='icon' />
			로그아웃
		</Button>
		{#if contactDepartment}
			<div class='contact-text text-right text-sm text-gray-600'>
				<p>{contactDepartment}</p>
				<p>{contact == undefined ? "연락처를 찾을 수 없습니다" : contact}</p>
			</div>
		{:else}
			<div class='flex flex-col items-end'>
				<Skeleton class='w-16 h-4 rounded-sm bg-gray-300'></Skeleton>
				<Skeleton class='w-20 h-4 mt-1 rounded-sm bg-gray-300 min-w-2/5'></Skeleton>
			</div>
		{/if}
	</div>
	<div class='grow overflow-scroll'>
		<LockerReserveInfo {targetDepartmentId} {serviceConfig} />
	</div>

</NavigationShell>