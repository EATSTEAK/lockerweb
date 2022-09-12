<script lang='ts'>
	import Entry from '../../components/molecule/login/Entry.svelte';
	import ChevronDown from '../../icons/ChevronDown.svelte';
	import ArrowClockwise from '../../icons/ArrowClockwise.svelte';
	import Button from '../../components/atom/Button.svelte';
	import { browser } from '$app/env';
	import NavigationFooter from '../../components/atom/NavigationFooter.svelte';
	import Shell from '../../components/molecule/Shell.svelte';
	import Navigation from '../../components/molecule/Navigation.svelte';
	import NavigationContent from '../../components/atom/NavigationContent.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';
	import { apiLogout } from '$lib/api/auth';
	import { goto } from '$app/navigation';

	let result;
	let id;

	if (browser) {
		result = new URLSearchParams(window.location.search).get('result');
		id = apiLogout();
		document.cookie = `locker_session=; path=/; domain=${window.location.hostname}; max-age=-9999999; samesite=lax`;
		id.then((data) => {
			goto('/');
		});
	}
</script>

<PageTitle name='로그아웃 중...' />

<Shell>
	<Navigation slot='navigation' class='w-full h-full min-h-screen' collapsable={false}>
		<NavigationContent>
			<Entry class='h-full justify-center' name='SOONGSIL UNIV. IT'>
				<Button disabled class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
					로그아웃 중...
					<ArrowClockwise class='animate-spin' slot='icon' />
				</Button>
			</Entry>
		</NavigationContent>
		<NavigationFooter class='block md:hidden'>
			<div class='w-full flex justify-center items-center'>
				<ChevronDown class='animate-bounce ease-in-out text-gray-700 w-8 h-8' />
			</div>
		</NavigationFooter>
	</Navigation>
</Shell>
