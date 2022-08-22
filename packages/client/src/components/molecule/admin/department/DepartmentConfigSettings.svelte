<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import SaveEdit from '../../../../icons/SaveEdit.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
	import Add from '../../../../icons/Add.svelte';
	import isEqual from 'lodash.isequal';
	import { createEventDispatcher } from 'svelte';

	export let original: DepartmentConfig;
	export let isNew = false;

	const dispatch = createEventDispatcher<{
		delete: ConfigDeleteRequest,
		update: DepartmentConfigUpdateRequest
	}>();

	let id: string;
	let name: string;
	let activateFrom: Date;
	let activateTo: Date;
	let contact: string;

	function initializeValues() {
		id = original?.id ?? '';
		name = original?.name ?? '';
		activateFrom = original?.activateFrom ? new Date(original?.activateFrom) : undefined;
		activateTo = original?.activateTo ? new Date(original?.activateTo) : undefined;
		contact = original?.contact ?? '';
	}

	$: if (original || isNew) initializeValues();

	$: newConfig = {
		id,
		name,
		...(activateFrom && { activateFrom: activateFrom.toISOString() }),
		...(activateTo && { activateTo: activateTo.toISOString() }),
		...(contact && { contact })
	};

	$: isModified = !isEqual(original, newConfig);

	const isNotAlphabet = new RegExp('\\W+');
	$: isAppliable = id && name && !isNotAlphabet.test(id);
	$: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

	function deleteDepartment() {
		// TODO: Run this function after Confirmation modal.
		dispatch('delete', { id });
	}

	function updateDepartment() {
		// TODO: Run this function after Confirmation modal.
		dispatch('update', newConfig);
	}
</script>

<div class='wrap'>
	<div class='editor'>
		{#if isNew}
			<h4>새 학부 추가</h4>
		{:else}
			<h4>{original.name} 수정</h4>
		{/if}
		<TextInput class='my-2' inputClass='reactive-input' id='id' label='학부 ID' showLabel disabled={!isNew}
							 bind:value={id} required={isNew} pattern='\w+' invalidClass='text-red-800'
							 invalidText={id ? 'ID는 알파벳 혹은 _ 만 허용됩니다.' : '이 값은 필수입니다.'} />
		<TextInput class='my-2' inputClass='reactive-input' id='name' label='학부 이름' showLabel
							 bind:value={name} required invalidClass='text-red-800' invalidText='이 값은 필수입니다.' />
		<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_from' label='예약 시작일' showLabel
									 bind:value={activateFrom} />
		<DateTimeInput class='my-2' inputClass='reactive-input' id='activate_to' label='예약 종료일' showLabel
									 bind:value={activateTo} />
		<TextInput class='my-2' inputClass='reactive-input' id='contact' label='학부 연락처' showLabel
							 bind:value={contact} />
	</div>
	<div class='actions-wrap'>
		<hr />
		<div class='actions'>
			{#if !isNew}
				<Button on:click={deleteDepartment} class='bg-red-800 text-white' isIconRight>
					삭제
					<Delete slot='icon' />
				</Button>
			{/if}
			<Button disabled={isSaveDisabled} on:click={updateDepartment}
							class='bg-primary-800 text-white [&[disabled]]:bg-primary-400' isIconRight>
				{#if !isNew}
					저장
					<SaveEdit slot='icon' />
				{:else}
					추가
					<Add slot='icon' />
				{/if}
			</Button>
		</div>
	</div>
</div>

<style>
    .wrap {
        @apply h-full flex flex-col justify-between p-3;
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