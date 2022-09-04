<script lang='ts'>
	import NavigationShell from '../../components/molecule/NavigationShell.svelte';
	import type { LockerCount } from '$lib/types';
	import Button from '../../components/atom/Button.svelte';
	import UserReservedLocker from '../../components/molecule/reserve/UserReservedLocker.svelte';
	import LockerReserveInfo from '../../components/molecule/reserve/LockerReserveInfo.svelte';
	import Skeleton from '../../components/atom/Skeleton.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';
	import { config, user } from '$lib/store';

	let callbackUrl = undefined;
	let countData: LockerCountResponse;
	let lockerCount: LockerCount;

	let fetchStatus: boolean = false;

	let innerWidth: number = 0;

	let lockerSection: string;
	let lockerNumber: number;
	let contact: string;
	let userDepartmentId: string;
	let contactDepartment: string;

	$: buildingConfig = $config && $config.success ? $config.result.find(c => c.id === 'SERVICE') ?? {
		id: 'SERVICE',
		name: undefined,
		buildings: {}
	} : undefined;

	$:if ($user && $user.success) {
		userReserveLockerConverter($user.result);
		if ($config && $config.success) {
			loadContact($user.result, $config.result);
		}
	}

	function userReserveLockerConverter(userInfo: User) {
		if (userInfo?.lockerId) {
			const [building, floors, location] = userInfo.lockerId.split('-');
			lockerSection = location[0];
			lockerNumber = parseInt(location.slice(1));
		}
	}

	function loadContact(userInfo: User, config: Array<Config>) {
		if (userInfo?.department) {
			const isDepartmentSame = config.find(config => config.id === userInfo.department);
			userDepartmentId = userInfo.department;
			contact = isDepartmentSame.contact;
			contactDepartment = isDepartmentSame.name;
		}
	}
</script>

<PageTitle name='예약하기' />

<svelte:window bind:innerWidth />

<NavigationShell collapsable={innerWidth && innerWidth <= 768}>
	<div class='w-full h-96' slot='navigation_content'>
		<UserReservedLocker reservedSection={lockerSection} reservedNumber={lockerNumber} tillTime='00:00 ~ 14:00' />
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
		<LockerReserveInfo userDepartmentId={userDepartmentId} buildingConfig={buildingConfig} />
	</div>

</NavigationShell>