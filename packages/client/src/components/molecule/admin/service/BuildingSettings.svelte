<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import Delete from '../../../../icons/Delete.svelte';

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
		<div class='form-group'>
			<label for='building_id'>건물 번호</label>
			<input id='building_id' type='text' disabled={!isNew}
						 value={original?.id ?? ''}
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='building_name'>건물 이름</label>
			<input id='building_name' type='text'
						 value={original?.name ?? ''}
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
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
