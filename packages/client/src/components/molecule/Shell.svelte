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

	let clazz = '';
	export { clazz as class };

	let currentTime = new Date();

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

	$: if (!disableBlock && !isReservable($config, $user, currentTime)) {
		blockedModalOpen = true;
	}

	let blockedModalOpen = false;

	function isReservable(config: Config[], user: User, time: Date): boolean {
		if (!user || user.isAdmin) return true;
		const serviceConfig: ServiceConfig = (config ?? []).find((c: Config) => c.id === 'SERVICE') as ServiceConfig;
		const userDeptConfig: DepartmentConfig = (config ?? []).find((c: Config) => c.id === user.department) as DepartmentConfig;
		if (serviceConfig) {
			if (serviceConfig.activateFrom && new Date(serviceConfig.activateFrom).getTime() > time.getTime()) return false;
			if (serviceConfig.activateTo && new Date(serviceConfig.activateTo).getTime() < time.getTime()) return false;
		}
		if (userDeptConfig) {
			if (userDeptConfig.activateFrom && new Date(userDeptConfig.activateFrom).getTime() > time.getTime()) return false;
			if (userDeptConfig.activateTo && new Date(userDeptConfig.activateTo).getTime() < time.getTime()) return false;
		}
		return true;
	}


	export let navigationClass = '';
	export let mainClass = '';

	export let disableBlock = false;
</script>

<main class='{clazz} flex flex-col md:flex-row items-stretch'>
	<section class='{navigationClass} flex flex row w-full md:min-w-[380px] md:basis-[380px] md:h-screen'>
		<slot name='navigation'>
			<Navigation class='flex-row w-full h-full'>
				<NavigationHeader class='md:py-10' slot='header'>
					<Soongsil class='w-20 h-20' />
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
	<section class='{mainClass} grow md:max-h-screen overflow-x-scroll md:overflow-y-scroll'>
		<slot />
	</section>
</main>

<Modal title='예약 불가 알림' bind:open={blockedModalOpen} preventOutclick on:cancel={() => console.log('hello')}
			 secondaryClass='hidden'
			 primaryText='로그아웃' isPrimaryBtnIconRight on:click={() => goto('/logout')}>
	현재 예약 가능한 시간이 아닙니다.
	<ArrowExportLtr slot='primaryIcon' />
</Modal>