<script lang='ts'>
	import { onMount } from 'svelte';

	export let id: string;
	export let value: Date | undefined;
	export let label: string;
	export let showLabel: boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	export let invalidClass: string = '';
	export let invalidText: string = '이 값은 올바르지 않습니다.';
	let clazz = '';
	export { clazz as class };

	let localDate: string;
	let mounted = false;

	onMount(() => {
		localDate = value
			? new Date(value.getTime() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.slice(0, -1)
			: undefined;
		mounted = true;
	});

	$: if (mounted && localDate) {
		value = new Date(localDate);
	}
</script>

<div class='{clazz} flex flex-col'>
	<label class='{labelClass} font-bold block mb-1' for={id} class:hidden={!showLabel}
	>{label ?? ''} <span class:hidden={!$$props.required} class='text-red-800'>*</span></label
	>
	<input
		id={id}
		type='datetime-local'
		class='{inputClass} transition-all rounded-md bg-gray-100 border-transparent
				 		hover:bg-gray-200 focus:bg-white
						disabled:bg-gray-300 disabled:text-gray-400'
		bind:value={localDate}
		{...$$restProps}
	/>
	<p class='{invalidClass} mt-1 hidden'>{invalidText}</p>
</div>

<style>
    input:invalid ~ p {
        @apply block;
    }
</style>
