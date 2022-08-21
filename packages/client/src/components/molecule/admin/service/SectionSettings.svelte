<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import SubsectionSettings from './SubsectionSettings.svelte';
	import Tag from '../../../atom/Tag.svelte';
	import Add from '../../../../icons/Add.svelte';

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
		<div class='form-group'>
			<label for='floor'>층</label>
			<input id='floor' type='text' disabled={!isNew}
						 value={floor ?? ''}
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='building_id'>구역 이름</label>
			<input id='building_id' type='text' disabled={!isNew}
						 value={originalId ?? ''}
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='disabled'>사용 불가 사물함 목록</label>
			<div class='disabled-input'>
				<input id='disabled' type='text'
							 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
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
        @apply rounded-md bg-gray-200 text-gray-500;
    }

    .disabled-add-btn:hover {
        @apply brightness-90;
    }

    .disabled-add-btn:active {
        @apply brightness-75;
    }

    :global(.disabled-id) {
        @apply cursor-pointer;
    }

    :global(.disabled-id:hover) {
        @apply brightness-90;
    }

    .actions {
        @apply flex justify-end gap-1 mt-3;
    }

    .form-group {
        @apply my-2 flex flex-col items-start;
    }

    .form-group label {
        @apply font-bold block mb-1;
    }
</style>
