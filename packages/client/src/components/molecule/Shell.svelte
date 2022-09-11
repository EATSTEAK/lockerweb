<script lang='ts'>
	import Navigation from './Navigation.svelte';
	import NavigationHeader from '../atom/NavigationHeader.svelte';
	import Soongsil from '../../icons/Soongsil.svelte';
	import NavigationContent from '../atom/NavigationContent.svelte';
	import NavigationFooter from '../atom/NavigationFooter.svelte';
	import Divider from '../../components/atom/Divider.svelte';
	import Button from '../atom/Button.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import { goto } from '$app/navigation';
	import { config, user } from '$lib/store';
	import { getDepartmentConfig, getServiceConfig } from '$lib/api/config';
	import { isActivated } from '$lib/utils';
	import Info from '../../icons/Info.svelte';

	let clazz = '';
	export { clazz as class };

	let currentTime = new Date();

	$: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

	onMount(() => {
		if (!disableBlock) {
			const interval = setInterval(() => {
				currentTime = new Date();
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	});

	$: if ($config && $config.success && $user && $user.success && !disableBlock && !isReservable($config.result, $user.result, currentTime)) {
		blockedModalOpen = true;
	}

	let blockedModalOpen = false;

	function isReservable(config: Config[], user: User, time: Date): boolean {
		if (!user || user.isAdmin) return true;
		const userDeptConfig: DepartmentConfig = getDepartmentConfig(config, user.department) as DepartmentConfig;
		if (serviceConfig) {
			return isActivated(serviceConfig.activateFrom as Date, serviceConfig.activateTo as Date);
		}
		if (userDeptConfig) {
			return isActivated(userDeptConfig.activateFrom as Date, userDeptConfig.activateTo as Date);
		}
		return true;
	}


	export let navigationClass = '';
	export let mainClass = '';

	export let disableBlock = false;
</script>

<main class='{clazz} flex flex-col md:flex-row items-stretch'>
	<section class='{navigationClass} flex row w-full md:min-w-[380px] md:basis-[380px] md:h-screen'>
		<slot name='navigation'>
			<Navigation class='flex-row w-full h-full'>
				<NavigationHeader class='py-1 md:py-0 md:pt-10' slot='header'>
					<Soongsil class='w-12 h-12 md:w-20 md:h-20' />
				</NavigationHeader>
				<Divider class='my-6' />
				<NavigationContent>
				</NavigationContent>
				<NavigationFooter>
					<Button class='bg-primary-800 text-white' isIconRight={true} href='/logout'>
						<ArrowExportLtr slot='icon' />
						로그아웃
					</Button>
					<Button on:click={() => blockedModalOpen = true}>
						예약불가
					</Button>
				</NavigationFooter>
			</Navigation>
		</slot>
	</section>
	<section class='{mainClass} grow md:max-h-screen overflow-x-auto md:overflow-y-auto'>
		{#if serviceConfig && serviceConfig.alert}
			<div class='bg-primary-200 rounded-md p-6 m-2 flex gap-3'>
				<Info />
				<div class='grow'>
					<span class='font-bold'>안내:</span> {serviceConfig.alert}
				</div>
			</div>
		{/if}
		<slot />
	</section>
</main>

<Modal title='예약 불가 알림' bind:open={blockedModalOpen} preventOutclick on:cancel={() => console.log('hello')}
			 secondaryClass='hidden'
			 primaryText='로그아웃' isPrimaryBtnIconRight on:click={() => goto('/logout')}>
	현재 예약 가능한 시간이 아닙니다.
	<ArrowExportLtr slot='primaryIcon' />
</Modal>