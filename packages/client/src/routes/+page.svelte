<script lang='ts'>
	import Entry from '../components/molecule/login/Entry.svelte';
	import Button from '../components/atom/Button.svelte';
	import Soongsil from '../icons/Soongsil.svelte';
	import DepartmentLockerInfo from '../components/molecule/login/LockerStatus.svelte';
	import { browser } from '$app/env';
	import { getAuthorization } from '$lib/auth';
	import { config } from '$lib/store';
	import type { DepartmentLockerCount, LockerCount } from '$lib/types';
	import { variables } from '$lib/variables';
	import { getDepartmentLockerCountsByFloor } from '$lib/utils';
	import Shell from '../components/molecule/Shell.svelte';
	import Navigation from '../components/molecule/Navigation.svelte';
	import NavigationContent from '../components/atom/NavigationContent.svelte';
	import NavigationFooter from '../components/atom/NavigationFooter.svelte';
	import Credit from '../components/molecule/Credit.svelte';
	import ChevronDown from '../icons/ChevronDown.svelte';
	import PageTitle from '../components/atom/PageTitle.svelte';
	import Modal from '../components/molecule/Modal.svelte';
	import Dismiss from '../icons/Dismiss.svelte';

	let callbackUrl = undefined;

	let countData: LockerCountResponse;

	let lockerCount: LockerCount;

	let contactModalOpen = false;

	$: callbackNotLoaded = true;
	$: mappedConfigsData = {};

	if (browser) {
		if (getAuthorization()) {
			window.location.href = '/reserve';
		}
		callbackUrl = window.location.protocol + '//' + window.location.host + '/callback';
		callbackNotLoaded = false;
		fetch(variables.baseUrl + '/api/v1/locker/count')
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					countData = data.result;
					console.log(countData);
				} else {
					console.error(data.errorDescription);
				}
			})
			.catch((error) => console.error(error));
	}


	$: if ($config && countData) {
		// console.log('Data received');
		const mappedConfig: Record<string, Config> = Object.fromEntries($config.map<[string, Config]>((value) => [value.id, value]));
		lockerCount = updateLockerCount(mappedConfig, countData);
	}

	function updateLockerCount(configs: Record<string, Config>, countInfo: LockerCountResponse): LockerCount {
		const departmentConfigs = { ...configs };
		delete departmentConfigs['SERVICE'];

		function transformLockerCount(
			serviceConfig: ServiceConfig,
			departmentConfig: DepartmentConfig,
			departmentCount?: { [floor: string]: number }
		): DepartmentLockerCount {
			const floorLockers = getDepartmentLockerCountsByFloor(serviceConfig, departmentConfig.id);
			const totalLocker = Object.values(floorLockers).reduce<number>((a: number, v: number) => a + v, 0);
			const totalReserved = departmentCount ? Object.values(departmentCount).reduce<number>((a: number, v: number) => a + v, 0) : 0;
			const floors = Object.fromEntries(
				Object.entries(floorLockers).map(([floor, count]) => ([floor,
					{
						canReserve: count >= (departmentCount?.[floor] ?? 0),
						percentage: Math.round(((departmentCount?.[floor] ?? 0) / count) * 100),
						totalLocker: count,
						lockerLeft: count - (departmentCount?.[floor] ?? 0)
					}
				]))
			);
			// console.log(departmentConfig.id, floorLockers);
			return {
				departmentName: departmentConfig.name,
				canReserve: (totalLocker > totalReserved),
				lockerLeft: (totalLocker - totalReserved),
				totalLocker,
				...(departmentConfig.activateFrom && { activateFrom: new Date(departmentConfig.activateFrom) }),
				...(departmentConfig.activateTo && { activateTo: new Date(departmentConfig.activateTo) }),
				contact: departmentConfig.contact ?? '',
				floors
			};
		}

		return Object.fromEntries(Object.entries(departmentConfigs).map(([key, value]) => [key, transformLockerCount(configs.SERVICE as ServiceConfig, value, countInfo?.[key])]));
	}

</script>

<PageTitle />

<Shell mainClass='p-10'>
	<Navigation slot='navigation' class='w-full h-full min-h-screen' collapsable={false}>
		<NavigationContent>
			<Entry class='grow h-full justify-center' name='SOONGSIL UNIV. IT'>
				<Button
					disabled={callbackUrl ? undefined : true}
					href='https://class.ssu.ac.kr/xn-sso/gw.php?login_type=sso&callback_url={encodeURIComponent(callbackUrl)}'
					rel='external'
					class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight>
					통합 로그인
					<Soongsil class='w-8 h-8' slot='icon' />
				</Button>
				<div class='flex flex-row justify-between my-3'>
					<Credit />
					<Button on:click={() => contactModalOpen = true}
									class='px-0 py-0 !shadow-none text-primary-800 underline hover:!shadow-none hover:text-primary-900 active:!shadow-none active:drop-shadow-md'>
						도움이 필요하신가요?
					</Button>
				</div>
			</Entry>
		</NavigationContent>
		<NavigationFooter class='block md:hidden'>
			<div class='w-full flex justify-center items-center'>
				<ChevronDown class='animate-bounce ease-in-out text-gray-700 w-8 h-8' />
			</div>
		</NavigationFooter>
	</Navigation>
	<DepartmentLockerInfo bind:lockerCount />
</Shell>

<Modal title='학과(부) 연락처' bind:open={contactModalOpen} secondaryClass='hidden' primaryText='닫기'
			 on:close={() => contactModalOpen = false}
			 on:click={() => contactModalOpen = false}>
	{#each ($config ?? []) as config}
		{#if config?.contact}
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