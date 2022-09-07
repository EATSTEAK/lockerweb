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
		localDate = value ? new Date(value.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1) : undefined;
		mounted = true;
	});

	$: if (mounted && localDate) {
		value = new Date(localDate);
	}


</script>

<div class={clazz}>
	<label class={labelClass} for={id} hidden={!showLabel}>{label ?? ''} <span class:hidden={!$$props.required}
																																						 class='text-red-800'>*</span></label>
	<input id={id} type='datetime-local'
				 class={inputClass}
				 bind:value={localDate}
				 {...$$restProps}
	/>
	<p class={invalidClass}>{invalidText}</p>
</div>

<style>
    div {
        @apply flex flex-col;
    }

    label {
        @apply font-bold block mb-1;
    }

    label[hidden] {
        @apply hidden;
    }

    input {
        @apply transition-all rounded-md bg-gray-100 border-transparent;
    }

    input:hover {
        @apply bg-gray-200;
    }

    input:focus {
        @apply bg-white;
    }

    input:disabled {
        @apply bg-gray-300 text-gray-400;
    }

    p {
        @apply mt-1 hidden;
    }

    input:invalid ~ p {
        @apply block;
    }
</style>