<script lang='ts'>
	export let id: string;
	export let checked: boolean;
	export let label: string = null;
	export let showLabel: boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	let clazz = '';
	export { clazz as class };
</script>

<div class='{clazz} flex flex-col'>
	<label class='{labelClass} font-bold block mb-1' for={id} class:hidden={!showLabel}>{label ?? ''}</label>
	<input
		id={id}
		type='checkbox'
		on:change
		on:input
		class='{inputClass} transition-all rounded-md'
		bind:checked
		{...$$restProps}
	/>
</div>

<style>
    input:not(:checked) {
        @apply bg-gray-100 border-gray-400;
    }

    input:checked {
        @apply bg-primary-800 text-white;
    }

    input:checked:hover {
        @apply bg-primary-800;
    }

    input:checked:active {
        @apply bg-primary-800;
    }

    input:checked:focus {
        @apply outline-0 bg-primary-800;
    }

    input:hover:not(:disabled) {
        @apply brightness-90 scale-101;
    }

    input:focus {
        @apply outline-0 scale-100;
    }

    input:active:not(:disabled) {
        @apply brightness-75;
    }

    input:disabled:not(:checked) {
        @apply bg-gray-300 text-gray-400;
    }

    input:disabled:checked {
        @apply bg-primary-500 text-gray-400;
    }
</style>
