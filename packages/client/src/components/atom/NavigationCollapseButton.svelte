<script lang='ts'>
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import ChevronDown from '../../icons/ChevronDown.svelte';

	let clazz = '';
	export { clazz as class };

	let { collapsed, set } = getContext<{ collapsed: Writable<boolean>, set: (isCollapsed: boolean) => void }>('Sidebar');

</script>

<button
	class='{clazz} p-1 rounded-md hover:brightness-95 hover:backdrop-brightness-95 active:backdrop-brightness-75 active:brightness-75'
	on:click={() => set(!$collapsed)}>
	<ChevronDown class='transition-all{$collapsed ? " rotate-180" : ""}' />
</button>

<style>
</style>