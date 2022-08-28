<script lang='ts'>
	import Navigation from './Navigation.svelte';
	import NavigationHeader from '../atom/NavigationHeader.svelte';
	import Soongsil from '../../icons/Soongsil.svelte';
	import NavigationProfile from '../atom/NavigationProfile.svelte';
	import { config, user } from '$lib/store';
	import Profile from '../../components/molecule/Profile.svelte';
	import NavigationContent from '../atom/NavigationContent.svelte';
	import NavigationFooter from '../atom/NavigationFooter.svelte';
	import Divider from '../../components/atom/Divider.svelte';
	import NavigationCollapseButton from '../atom/NavigationCollapseButton.svelte';
	import Button from '../atom/Button.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
	import Shell from './Shell.svelte';
	import { fly } from 'svelte/transition';

	export let navigationCollapsed = true;

	export let collapsable = true;

	$: serviceName = ($config ?? []).find((c: Config) => c.id === 'SERVICE')?.name ?? '사물함 시스템';
</script>

<Shell bind:navigationCollapsed bind:collapsable>
	<Navigation slot='navigation' class='flex-row w-full md:min-w-[380px] md:w-[380px] md:basis-[380px] md:h-screen'
							{collapsable} bind:collapsed={navigationCollapsed}>
		<NavigationHeader class='md:pt-10' slot='header'>
			<slot name='navigation_header'>
				<div class='flex flex-col grow items-start flex-wrap'>
					<Soongsil class='w-20 h-20' />
				</div>
				{#if collapsable}
					<div class='flex justify-center items-center'>
						<NavigationCollapseButton />
					</div>
				{/if}
			</slot>
		</NavigationHeader>
		<p transition:fly={{ y: -20, duration: 200 }} class='font-semibold shrink'>{serviceName}</p>
		<NavigationProfile>

			<slot name='navigation_profile'>
				<Profile user={$user} />
			</slot>
		</NavigationProfile>
		<Divider class='my-6' />
		<NavigationContent>
			<slot name='navigation_content' />
		</NavigationContent>
		<NavigationFooter>
			<slot name='navigation_footer'>
				<Button class='bg-primary-800 text-white' isIconRight={true} href='/logout'>
					<ArrowExportLtr slot='icon' />
					로그아웃
				</Button>
			</slot>
		</NavigationFooter>
	</Navigation>
	<slot />
</Shell>