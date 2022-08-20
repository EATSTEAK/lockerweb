<script lang='ts'>
	import Button from '../atom/Button.svelte';
	import SaveEdit from '../../icons/SaveEdit.svelte';
	import Delete from '../../icons/Delete.svelte';

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
		<div class='form-group'>
			<label for='department_id'>학부 ID</label>
			<input id='department_id' type='text'
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='department_name'>학부명</label>
			<input id='department_name' type='text'
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='activate_from'>예약 시작일</label>
			<input id='activate_from' type='datetime-local'
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='activate_to'>예약 종료일</label>
			<input id='activate_to' type='datetime-local'
						 class='form-input rounded-md bg-gray-100 border-transparent focus:bg-white' />
		</div>
		<div class='form-group'>
			<label for='contact'>학부 연락처</label>
			<input id='contact' type='text'
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
        @apply my-2;
    }

    .form-group label {
        @apply font-bold block mb-1;
    }
</style>