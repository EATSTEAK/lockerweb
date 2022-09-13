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
	import ErrorCircle from '../../icons/ErrorCircle.svelte';
	import Checkmark from '../../icons/Checkmark.svelte';
	import ErrorScreen from '../../components/atom/ErrorScreen.svelte';

	let result;
	let id;
	let response;

	let errorMessage;

	$: if (response && response.success === false) {
		if (response.error.name === 'Unauthorized') {
			errorMessage = '이미 로그아웃 되어 있습니다.';
		} else {
			errorMessage = '알 수 없는 오류입니다. 관리자에게 문의하세요.';
		}
	}

	if (browser) {
		result = new URLSearchParams(window.location.search).get('result');
		id = apiLogout();
		document.cookie = `locker_session=; path=/; domain=${window.location.hostname}; max-age=-9999999; samesite=lax`;
		id.then((data) => {
			response = data;
			if(data.success) {
				goto('/', { replaceState: true });
			} else {
				setTimeout(() => goto('/', { replaceState: true }), 5000);
			}
		}).catch((err) => {
			response = err;
			setTimeout(() => goto('/', { replaceState: true}), 5000);
		})
	}
</script>

<PageTitle name='로그아웃 중...' />

<Shell>
	<Navigation slot='navigation' class='w-full h-full min-h-screen' collapsable={false}>
		<NavigationContent>
			<Entry class='h-full justify-center' name='SOONGSIL UNIV. IT'>
				{#if !response}
					<Button disabled class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight>
						로그아웃 중...
						<ArrowClockwise class='animate-spin' slot='icon' />
					</Button>
				{:else if !response.success}
					<Button disabled class='bg-red-800 text-white w-full h-16 text-xl' isIconRight>
						로그아웃 실패
						<ErrorCircle class='animate-spin' slot='icon' />
					</Button>
				{:else if response.success}
					<Button disabled class='bg-green-800 text-white w-full h-16 text-xl' isIconRight>
						로그아웃 성공
						<Checkmark slot='icon' />
					</Button>
				{/if}
			</Entry>
		</NavigationContent>
		<NavigationFooter class='block lg:hidden'>
			<div class='w-full flex justify-center items-center'>
				<ChevronDown class='animate-bounce ease-in-out text-gray-700 w-8 h-8' />
			</div>
		</NavigationFooter>
	</Navigation>
	{#if response && response.success === false}
		<ErrorScreen errorTitle={response.error.code} {errorMessage} />
	{/if}
</Shell>
