<script lang='ts'>
	export let id: string;
	export let checked: boolean;
	export let label: string;
	export let showLabel: boolean = false;
	export let disabled: boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	let clazz = '';
	export { clazz as class };

</script>

<div class={clazz}>
	<label class={labelClass} for={id} hidden={!showLabel}>{label ?? ''}</label>
	<input id={id} type='checkbox'
				 {disabled}
				 class={inputClass}
				 {checked}
	/>
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
        @apply transition-all rounded-md;
    }

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
        @apply brightness-90 scale-[1.01];
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