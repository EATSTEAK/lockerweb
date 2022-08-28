<script lang='ts'>
	import Entry from '../../components/molecule/login/Entry.svelte';
	import ChevronDown from '../../icons/ChevronDown.svelte';
	import ArrowClockwise from '../../icons/ArrowClockwise.svelte';
	import Button from '../../components/atom/Button.svelte';
	import { browser } from '$app/env';
	import { variables } from '$lib/variables';
	import NavigationFooter from '../../components/atom/NavigationFooter.svelte';
	import Shell from '../../components/molecule/Shell.svelte';
	import Navigation from '../../components/molecule/Navigation.svelte';
	import NavigationContent from '../../components/atom/NavigationContent.svelte';
	import PageTitle from '../../components/atom/PageTitle.svelte';

	let result;
	let id;

	if (browser) {
		result = new URLSearchParams(window.location.search).get('result');
		id = fetch(variables.baseUrl + '/api/v1/auth/ssu_login?result=' + encodeURIComponent(result)).then((res) => res.json());
		id.then((data) => {
			const result: AccessTokenInfo = data.result;
			document.cookie = `locker_session=${encodeURIComponent(result.accessToken)}; path=/; domain=${window.location.hostname}; max-age=${result.expiresIn}; samesite=lax`;
			window.location.href = `/reserve`;
		});
	}
</script>

<PageTitle name='로그인 중...' />

<Shell mainClass='p-10'>
	<Navigation slot='navigation' class='w-full h-full min-h-screen' collapsable={false}>
		<NavigationContent>
			<Entry class='h-full justify-center' name='SOONGSIL UNIV. IT'>
				<Button
					disabled
					class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
					로그인 중...
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