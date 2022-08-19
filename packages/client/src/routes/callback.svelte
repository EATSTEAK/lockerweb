<script lang='ts'>
	import Entry from '../components/molecule/Entry.svelte';
	import ChevronDown from '../icons/ChevronDown.svelte';
	import ArrowClockwise from '../icons/ArrowClockwise.svelte';
	import Button from '../components/atom/Button.svelte';
	import { browser } from '$app/env';
	import { variables } from '$lib/variables';

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
<div class='root'>
	<div class='entry-wrap'>
		<div class='entry'>
			<Entry name='SOONGSIL UNIV. IT'>
				<Button
					disabled
					class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
					로그인 중...
					<ArrowClockwise class='animate-spin' slot='icon' />
				</Button>

			</Entry>
		</div>
		<div class='arrow'>
			<ChevronDown class='text-gray-700 w-8 h-8' />
		</div>
	</div>
	<div class='info'>
	</div>
</div>


<style>
    .root {
        @apply flex flex-col md:flex-row items-stretch;
    }

    .arrow {
        @apply block md:hidden flex justify-center items-center -mt-10 pb-4;
    }

    .arrow {
        @apply animate-bounce ease-in-out;
    }

    .entry-wrap {
        @apply bg-gray-200 w-full md:w-[480px] flex flex-col justify-between;
    }

    .entry {
        @apply flex flex-col justify-center min-h-screen;
    }

    .info {
        @apply p-8 grow;
    }
</style>