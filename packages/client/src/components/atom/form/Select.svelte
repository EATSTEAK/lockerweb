<script lang='ts'>
	export let id: string;
	export let label: string;
	export let value: string;
	export let showLabel: boolean = false;
	export let labelClass: string = '';
	export let selectClass: string = '';
	export let invalidClass: string = '';
	export let invalidText: string = '값을 입력하세요.';
	let clazz = '';
	export { clazz as class };

</script>

<div class={clazz}>
	<label class={labelClass} for={id} hidden={!showLabel}>{label ?? ''} <span class:hidden={!$$props.required}
																																						 className='text-red-800'>*</span></label>
	<select id={id} class={selectClass} bind:value {...$$restProps}>
		<slot />
	</select>
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

    select {
        @apply transition-all rounded-md bg-gray-100 border-transparent;
    }

    select:hover {
        @apply bg-gray-200;
    }

    select:focus {
        @apply bg-white;
    }

    select:disabled {
        @apply bg-gray-300 text-gray-400;
    }

    p {
        @apply mt-1 hidden;
    }

    input:invalid ~ p {
        @apply block;
    }
</style>