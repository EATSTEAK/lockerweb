<script lang='ts'>
	import NavigationShell from '../../components/molecule/NavigationShell.svelte';
	import type { LockerCount } from '$lib/types';
	import Button from '../../components/atom/Button.svelte';
	import UserReservedLocker from '../../components/molecule/reserve/UserReservedLocker.svelte';
	import LockerReserveInfo from '../../components/molecule/reserve/LockerReserveInfo.svelte';
	import Skeleton from '../../components/atom/Skeleton.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';

	let callbackUrl = undefined;
	let countData: LockerCountResponse;
	let lockerCount: LockerCount;

	let fetchContactStatus: boolean = false;
</script>

<PageTitle name='예약하기' />

<NavigationShell>
	<div class='w-full h-96' slot='navigation_content'>
		<UserReservedLocker reservedSection='A' reservedNumber='15' tillTime='00:00 ~ 14:00' />
	</div>
	<div class='flex justify-between w-full' slot='navigation_footer'>
		<Button class='bg-primary-800 text-white' isIconRight={true} href='/logout'>
			<ArrowExportLtr slot='icon' />
			로그아웃
		</Button>
		{#if fetchContactStatus}
			<div class='contact-text'>
				<p>글로벌미디어학부</p>
				<p>010-1234-1234</p>
			</div>
		{:else}
			<div class='flex flex-col'>
				<Skeleton class='contact-text-skeleton min-w-2/5'></Skeleton>
				<Skeleton class='contact-number-skeleton'></Skeleton>
			</div>
		{/if}
	</div>
	<div class='grow overflow-scroll'>
		<LockerReserveInfo />
	</div>

</NavigationShell>

<style>
    :global(.contact-text-skeleton) {
        @apply w-20 h-4 rounded-sm bg-gray-300;
    }

    :global(.contact-number-skeleton) {
        @apply w-16 h-4 mt-1 rounded-sm bg-gray-300;
    }
</style>