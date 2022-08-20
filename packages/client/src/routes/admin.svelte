<script lang='ts'>
	import Soongsil from '../icons/Soongsil.svelte';
	import Button from '../components/atom/Button.svelte';
	import ArrowExportLtr from '../icons/ArrowExportLtr.svelte';
	import MailInbox from '../icons/MailInbox.svelte';
	import Profile from '../components/molecule/Profile.svelte';
	import SelectionListItemGroup from '../components/atom/SelectionListItemGroup.svelte';
	import SelectionListItem from '../components/atom/SelectionListItem.svelte';
	import UserSettings from '../components/molecule/UserSettings.svelte';
	import ServiceSettings from '../components/molecule/ServiceSettings.svelte';
	import { user } from '$lib/store';


	let selectedTab;
</script>

<div class='root'>
	<div class='side-wrap'>
		<div class='logo'>
			<Soongsil class='w-20 h-20' />
		</div>
		<div class='content'>
			<div class='flex flex-col gap-4'>
				<Profile user={$user} />
				<hr />
			</div>
			<div class='flex flex-col gap-3'>
				<h3>설정</h3>
				<SelectionListItemGroup bind:selectedId={selectedTab}>
					<SelectionListItem id='user'>
						사용자 설정
					</SelectionListItem>
					<SelectionListItem id='service'>
						서비스 설정
					</SelectionListItem>
				</SelectionListItemGroup>
			</div>
		</div>
		<div class='footer'>
			<Button class='bg-primary-900 text-white' isIconRight={true}>
				<ArrowExportLtr slot='icon' />
				로그아웃
			</Button>
			<Button class='bg-green-200 text-black' isIconRight={true} href='/reserve'>
				<MailInbox slot='icon' />
				예약 페이지로
			</Button>
		</div>
	</div>
	<div class='dashboard'>
		{#if selectedTab === "user"}
			<UserSettings />
		{:else if selectedTab === "service"}
			<ServiceSettings />
		{/if}
	</div>
</div>

<style>
    .root {
        @apply flex flex-col md:flex-row items-stretch;
    }

    .side-wrap {
        @apply bg-gray-200 w-full md:min-w-[380px] md:w-[380px] flex flex-col justify-between min-h-screen px-10;
    }

    .content {
        @apply flex flex-col justify-evenly grow;
    }

    hr {
        @apply h-0.5 mx-8 bg-gray-400;
    }

    .dashboard {
        @apply p-8 grow h-screen overflow-y-scroll bg-gray-100;
    }

    .logo {
        @apply pt-8;
    }

    .footer {
        @apply pb-4 flex flex-wrap justify-between;
    }
</style>