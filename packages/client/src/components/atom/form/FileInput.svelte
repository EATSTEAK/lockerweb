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

	let ref;
	let value;
	let clazz = '';
	export { clazz as class };

	function openFileDialog() {
		if (ref) ref.click();
	}
</script>

<div class='{clazz} flex flex-col'>
	<label for={id} class='font-bold block mb-1'>
		<div class='flex flex-col'>
			<p class={labelClass} hidden={!showLabel}>
				{label ?? ''} <span class:hidden={!$$props.required} class='text-red-800'>*</span>
			</p>
			<Button class='bg-primary-800 text-white' isIconRight on:click={openFileDialog}>
				<ArrowUpload slot='icon' />
				{#if !multiple && files && files.length}
					다시 업로드
				{:else}
					파일 업로드
				{/if}
			</Button>
		</div>
	</label>
	<input
		bind:this={ref}
		id={id}
		type='file'
		class='{inputClass} hidden'
		bind:files
		bind:value
		{...$$restProps}
	/>
	{#if files}
		{#each files ?? [] as file, index}
			<div
				class='flex flex-row gap-1 p-1 rounded-xl bg-gray-300 text-sm select-none text-gray-700 items-center'
			>
				<Document class='w-5 h-5' />
				<div class='grow'>{file.name}</div>
			</div>
		{/each}
	{/if}
	<p class={`invalid ${invalidClass}`}>{invalidText}</p>
</div>

<style>
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

    p.invalid {
        @apply mt-1 hidden;
    }

    input:invalid ~ p {
        @apply block;
    }
</style>
