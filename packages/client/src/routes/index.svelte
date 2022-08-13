<script>
	import Entry from '../components/molecule/Entry.svelte';
	import Button from '../components/atom/Button.svelte';
	import Soongsil from '../icons/Soongsil.svelte';
	import DepartmentLockerInfo from '../components/molecule/LockerStatus.svelte';
	import ChevronDown from '../icons/ChevronDown.svelte';
	import { browser } from '$app/env';
	import { getAuthorization } from '$lib/auth';

	let callbackUrl = undefined;

	$: callbackNotLoaded = true;

	if (browser) {
		if (getAuthorization()) {
			window.location.href = '/reserve';
		}
		callbackUrl = window.location.protocol + '//' + window.location.host + '/callback';
		callbackNotLoaded = false;
	}
</script>
<div class='root'>
	<div class='entry-wrap'>
		<div class='entry'>
			<Entry name='SOONGSIL UNIV. IT'>
				<Button
					bind:disabled={callbackNotLoaded}
					href='https://class.ssu.ac.kr/xn-sso/gw.php?login_type=sso&callback_url={encodeURIComponent(callbackUrl)}'
					class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
					통합 로그인
					<Soongsil class='w-8 h-8' slot='icon' />
				</Button>
			</Entry>
		</div>
		<div class='arrow'>
			<ChevronDown class='text-gray-700 w-8 h-8' />
		</div>
	</div>
	<div class='info'>
		<DepartmentLockerInfo />
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