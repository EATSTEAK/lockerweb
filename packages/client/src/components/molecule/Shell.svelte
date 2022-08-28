<script lang='ts'>
	import Navigation from './Navigation.svelte';
	import NavigationHeader from '../atom/NavigationHeader.svelte';
	import Soongsil from '../../icons/Soongsil.svelte';
	import NavigationContent from '../atom/NavigationContent.svelte';
	import NavigationFooter from '../atom/NavigationFooter.svelte';
	import Divider from '../../components/atom/Divider.svelte';
	import Button from '../atom/Button.svelte';
	import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';

	let clazz = '';
	export { clazz as class };

	export let navigationClass = '';
	export let mainClass = '';
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
				</NavigationFooter>
			</Navigation>
		</slot>
	</section>
	<section class='{mainClass} grow md:max-h-screen overflow-x-scroll md:overflow-y-scroll'>
		<slot />
	</section>
</main>