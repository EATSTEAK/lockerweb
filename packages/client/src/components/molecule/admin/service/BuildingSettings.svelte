<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import Add from '../../../../icons/Add.svelte';

	export let original: Building;
	export let isNew = false;
</script>

<div class='wrap'>
	<div class='editor'>
		{#if isNew}
			<h4>새 건물 추가</h4>
		{:else}
			<h4>{original.name} 수정</h4>
		{/if}
		<TextInput class='my-2' inputClass='reactive-input' id='id' label='건물 번호' showLabel disabled={!isNew}
							 value={original?.id ?? ''} />
		<TextInput class='my-2' inputClass='reactive-input' id='name' label='건물 이름' showLabel
							 value={original?.name ?? ''} />
	</div>
	<div class='actions-wrap'>
		<hr />
		<div class='actions'>
			{#if !isNew}
				<Button class='bg-red-800 text-white' isIconRight>
					삭제
					<Delete slot='icon' />
				</Button>
			{:else}
				<Button class='bg-primary-800 text-white' isIconRight>
					추가
					<Add slot='icon' />
				</Button>
			{/if}

		</div>
	</div>
</div>

<style>
    .wrap {
        @apply h-full flex flex-col justify-between p-3;
    }

    .wrap :global(.reactive-input) {
        @apply w-full max-w-sm;
    }

    .editor {
        @apply mb-3;
    }

    .actions {
        @apply flex justify-end gap-1 mt-3;
    }
</style>
