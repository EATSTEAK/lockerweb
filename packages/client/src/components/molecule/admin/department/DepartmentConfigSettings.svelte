<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';

	export let original: DepartmentConfig;
	export let isNew = false;
</script>

<div class='wrap'>
	<div class='editor'>
		{#if isNew}
			<h4>새 학부 추가</h4>
		{:else}
			<h4>{original.name} 수정</h4>
		{/if}
		<TextInput class='my-2' inputClass='reactive-input' id='id' label='학부 ID' showLabel disabled={!isNew}
							 value={original?.id ?? ''} />
		<TextInput class='my-2' inputClass='reactive-input' id='name' label='학부 이름' showLabel
							 value={original?.name ?? ''} />
		<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_from' label='예약 시작일' showLabel
									 value={original?.activateFrom ? new Date(original?.activateFrom) : undefined} />
		<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_to' label='예약 종료일' showLabel
									 value={original?.activateTo ? new Date(original?.activateTo) : undefined} />
		<TextInput class='my-2' inputClass='reactive-input' id='contact' label='학부 연락처' showLabel
							 value={original?.contact ?? ''} />
	</div>
	<div class='actions-wrap'>
		<hr />
		<div class='actions'>
			{#if !isNew}
				<Button class='bg-red-800 text-white' isIconRight>
					삭제
					<Delete slot='icon' />
				</Button>
			{/if}
			<Button class='bg-primary-800 text-white' isIconRight>
				저장
				<SaveEdit slot='icon' />
			</Button>
		</div>
	</div>
</div>

<style>
    .wrap {
        @apply flex flex-col justify-between p-3;
    }

    .editor :global(.reactive-input) {
        @apply w-full max-w-sm;
    }

    .editor {
        @apply flex flex-col mb-3;
    }

    .actions {
        @apply flex justify-end gap-1 mt-3;
    }
</style>