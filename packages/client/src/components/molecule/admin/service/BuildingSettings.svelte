<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import Add from '../../../../icons/Add.svelte';
	import Checkmark from '../../../../icons/Checkmark.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { BuildingRemoveRequest, BuildingUpdateRequest } from '$lib/types';

	const dispatch = createEventDispatcher<{
		remove: BuildingRemoveRequest;
		update: BuildingUpdateRequest;
	}>();

	export let original: Building;
	export let isNew = false;

	let id = original?.id ?? '';
	let name = original?.name ?? '';

	const isNotDigit = new RegExp('\\D+');

	$: isModified = original?.id !== id || original?.name !== name;
	$: isAppliable = !!id && !!name && id.length == 2 && !isNotDigit.test(id);

	$: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

	function removeBuilding() {
		dispatch('remove', { id });
	}

	function updateBuilding() {
		const req: BuildingUpdateRequest = { id, name };
		dispatch('update', req);
	}
</script>

<div class='h-full flex flex-col justify-between p-3'>
	<div class='mb-3'>
		{#if isNew}
			<h4>새 건물 추가</h4>
		{:else}
			<h4>{original.name} 수정</h4>
		{/if}
		<TextInput
			class='my-2'
			inputClass='w-full max-w-sm'
			id='id'
			label='건물 번호'
			showLabel
			disabled={!isNew}
			bind:value={id}
			required={isNew}
			pattern={`\\d{2}`}
			invalidClass='text-red-800'
			invalidText={id ? '이 값은 2자리 숫자여야 합니다.' : '이 값은 필수입니다.'}
		/>
		<TextInput
			class='my-2'
			inputClass='w-full max-w-sm'
			id='name'
			label='건물 이름'
			showLabel
			bind:value={name}
			required
			invalidClass='text-red-800'
			invalidText='이 값은 필수입니다.'
		/>
	</div>
	<div class='actions-wrap'>
		<hr />
		<div class='flex justify-end gap-1 mt-3'>
			{#if !isNew}
				<Button on:click={removeBuilding} class='bg-red-800 text-white' isIconRight>
					삭제
					<Delete slot='icon' />
				</Button>
				<Button
					on:click={updateBuilding}
					disabled={isSaveDisabled}
					class='bg-primary-800 text-white [&[disabled]]:opacity-[0.5]'
					isIconRight
				>
					적용
					<Checkmark slot='icon' />
				</Button>
			{:else}
				<Button
					on:click={updateBuilding}
					disabled={isSaveDisabled}
					class='bg-primary-800 text-white [&[disabled]]:opacity-[0.5]'
					isIconRight
				>
					추가
					<Add slot='icon' />
				</Button>
			{/if}
		</div>
	</div>
</div>
