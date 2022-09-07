<script lang='ts'>
	import Button from '../Button.svelte';
	import ArrowUpload from '../../../icons/ArrowUpload.svelte';
	import Document from '../../../icons/Document.svelte';

	export let id: string;
	export let files: FileList;
	export let label: string;
	export let multiple = false;
	export let showLabel: boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	export let invalidClass: string = '';
	export let invalidText: string = '이 값은 올바르지 않습니다.';

	let value;
	let clazz = '';
	export { clazz as class };

</script>

<div class={clazz}>
	<label for={id}>
		<div>
			<p class={labelClass} hidden={!showLabel}>{label ?? ''} <span class:hidden={!$$props.required}
																																		class='text-red-800'>*</span></p>
			<Button class='bg-primary-800 text-white' isIconRight>
				<ArrowUpload slot='icon' />
				{#if !multiple && files && files.length}
					다시 업로드
				{:else}
					파일 업로드
				{/if}
			</Button>
		</div>
	</label>
	<input id={id} type='file'
				 class={inputClass}
				 bind:files
				 bind:value
				 {...$$restProps}
	/>
	{#if files}
		{#each files ?? [] as file, index}
			<div class='file-item'>
				<Document class='w-5 h-5' />
				<div>{file.name}</div>
			</div>
		{/each}
	{/if}
	<p class={`invalid ${invalidClass}`}>{invalidText}</p>
</div>

<style>
    div {
        @apply flex flex-col;
    }

    input {
        @apply hidden;
    }

    label {
        @apply font-bold block mb-1;
    }

    label > div > p[hidden] {
        @apply hidden;
    }

    label > div > p:not([hidden]) {
        @apply block mb-1;
    }

    label ~ input:invalid {
        @apply outline-red-600;
    }

    input {
        @apply hidden;
    }

    label ~ input:hover {
        @apply brightness-95;
    }

    label ~ input:active {
        @apply brightness-75;
    }

    label ~ input:disabled {
        @apply bg-gray-300 text-gray-400;
    }

    .file-item {
        @apply flex flex-row gap-1 p-1 rounded-xl bg-gray-300 text-sm select-none text-gray-700 items-center;
    }

    .file-item > div {
        @apply grow;
    }

    p.invalid {
        @apply mt-1 hidden;
    }

    input:invalid ~ p {
        @apply block;
    }
</style>