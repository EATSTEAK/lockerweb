<script>
	import Entry from '../components/molecule/Entry.svelte';
	import Button from '../components/atom/Button.svelte';
	import Soongsil from '../icons/Soongsil.svelte';
	import DepartmentLockerInfo from '../components/molecule/LockerStatus.svelte';
	import ChevronDown from '../icons/ChevronDown.svelte';
</script>
<div class='root'>
	<div class='entry-wrap'>
		<div class='entry'>
			<Entry name='SOONGSIL UNIV. IT'>
				<Button class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
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