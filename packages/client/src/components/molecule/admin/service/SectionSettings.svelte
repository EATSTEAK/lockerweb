<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import SubsectionSettings from './SubsectionSettings.svelte';
	import Tag from '../../../atom/Tag.svelte';
	import Add from '../../../../icons/Add.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';

	export let floor: string = '';
	export let originalId: string;
	export let original: LockerSection;
	export let isNew = false;


	$: readableFloor = floor && floor.length < 2 ? `${floor}F` : floor;

	$: subsections = original?.subsections ?? [];
	console.log(subsections);
</script>
<div class='wrap'>
	<div class='editor'>
		{#if isNew}
			<h4>새 구역 추가</h4>
		{:else}
			<h4>{readableFloor} 구역 {originalId} 수정</h4>
		{/if}
		<TextInput class='my-2' inputClass='reactive-input' id='floor' label='층' showLabel disabled={!isNew}
							 value={floor ?? ''} />
		<TextInput class='my-2' inputClass='reactive-input' id='id' label='구역 이름' showLabel disabled={!isNew}
							 value={originalId ?? ''} />
		<div class='disabled-edit'>
			<p class='font-bold'>사용 불가 사물함 목록</p>
			<div class='disabled-input'>
				<TextInput class='my-2' inputClass='reactive-input' id='disabled' label='사용 불가 사물함 목록' value='' />
				<button class='disabled-add-btn'>
					<Add />
				</button>
			</div>
			<div class='disabled-list'>
				{#each original?.disabled ?? [] as disabledId}
					<Tag class='disabled-id bg-gray-400'>{disabledId}</Tag>
				{/each}
			</div>
		</div>
		<div class='my-2'>
			<SubsectionSettings {subsections} />
		</div>
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

    .wrap :global(.reactive-input) {
        @apply w-full max-w-sm;
    }

    .editor {
        @apply mb-3;
    }

    .disabled-input {
        @apply flex items-center gap-2;

    }

    .disabled-list {
        @apply py-3 flex flex-wrap;
    }

    .disabled-add-btn {
        @apply transition-all rounded-md bg-gray-200 text-gray-500;
    }

    .disabled-add-btn:hover {
        @apply brightness-90;
    }

    .disabled-add-btn:active {
        @apply brightness-75;
    }

    .actions {
        @apply flex justify-end gap-1 mt-3;
    }
</style>
