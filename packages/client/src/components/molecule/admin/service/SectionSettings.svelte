<script lang='ts'>
	import Button from '../../../atom/Button.svelte';
	import Delete from '../../../../icons/Delete.svelte';
	import SubsectionSettings from './SubsectionSettings.svelte';
	import Tag from '../../../atom/Tag.svelte';
	import Add from '../../../../icons/Add.svelte';
	import TextInput from '../../../atom/form/TextInput.svelte';
	import NumberInput from '../../../atom/form/NumberInput.svelte';
	import Checkmark from '../../../../icons/Checkmark.svelte';
	import type { SectionRemoveRequest, SectionUpdateRequest } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import isEqual from 'lodash.isequal';
	import Dismiss from '../../../../icons/Dismiss.svelte';

	export let floor: string = '';
	export let originalId: string;
	export let original: LockerSection;
	export let isNew = false;

	const dispatch = createEventDispatcher<{
		remove: SectionRemoveRequest;
		update: SectionUpdateRequest;
	}>();

	$: readableFloor = floor && floor.length < 2 ? `${floor}F` : floor;

	let floorInput: string = floor ?? '';
	let id: string = originalId ?? '';
	let height: number = original?.height ?? 0;
	let disabledInput: number = null;
	let disabledInputInvalid: string;
	let disabled: number[] = original?.disabled ?? [];
	let subsections: LockerSubsection[] = structuredClone(original?.subsections) ?? [];

	$: if ((floor && originalId) || isNew) {
		initializeValues();
	}

	const isNotUppercaseAlphabet = new RegExp('[^A-Z]+');
	const isNotNumeric = new RegExp('[^0-9]+');

	$: isModified =
		floor !== floorInput ||
		originalId !== id ||
		original?.height !== height ||
		!isEqual(disabled, original?.disabled ?? []) ||
		!isEqual(subsections, original?.subsections ?? []);
	$: isAppliable =
		!!floorInput &&
		!!id &&
		!!height &&
		id.length === 1 &&
		!isNotUppercaseAlphabet.test(id) &&
		!isNotNumeric.test(
			floorInput.startsWith('B') && floorInput.length >= 2 ? floorInput.slice(1) : floorInput
		);

	$: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

	function initializeValues() {
		floorInput = floor ?? '';
		id = originalId ?? '';
		height = original?.height ?? 0;
		disabledInput = null;
		disabledInputInvalid = undefined;
		disabled = original?.disabled ?? [];
		subsections = original?.subsections ?? [];
	}

	function isExistingLockerNum(num: number) {
		return !!subsections.find(({ range }) => range[0] <= num && range[1] >= num);
	}

	function addDisabled() {
		if (!disabledInput) {
			disabledInputInvalid = '값을 입력한 후 추가하세요.';
			return;
		}
		if (disabled.includes(disabledInput)) {
			disabledInputInvalid = '이미 존재하는 값입니다.';
			return;
		}
		if (!isExistingLockerNum(disabledInput)) {
			disabledInputInvalid = '이 구역엔 해당 번호를 가진 사물함은 존재하지 않습니다.';
			return;
		}
		disabled = [...disabled, disabledInput];
	}

	function removeDisabled(id: number) {
		disabled = disabled.filter((disabledId) => disabledId !== id);
	}

	function removeSection() {
		dispatch('remove', { floor: floorInput, id });
	}

	function updateSection() {
		const req: SectionUpdateRequest = { floor: floorInput, id, disabled, height, subsections };
		dispatch('update', req);
	}
</script>

<div class='h-full flex flex-col justify-between p-3'>
	<div class='mb-3'>
		{#if isNew}
			<h4>새 구역 추가</h4>
		{:else}
			<h4>{readableFloor} 구역 {originalId} 수정</h4>
		{/if}
		<TextInput
			class='my-2'
			inputClass='w-full max-w-sm'
			id='floor'
			label='층'
			showLabel
			disabled={!isNew}
			bind:value={floorInput}
			pattern='B?\d+'
			required
			invalidClass='text-red-800'
			invalidText={floorInput ? '층의 형식은 (B)숫자 형태입니다.' : '이 값은 필수입니다.'}
		/>
		<TextInput
			class='my-2'
			inputClass='w-full max-w-sm'
			id='id'
			label='구역 이름'
			showLabel
			disabled={!isNew}
			bind:value={id}
			pattern={`[A-Z]{1}`}
			required
			invalidClass='text-red-800'
			invalidText={id ? '알파벳 대문자 1자만 허용됩니다.' : '이 값은 필수입니다.'}
		/>
		<NumberInput
			class='my-2'
			inputClass='w-full max-w-sm'
			id='height'
			label='사물함 세로 높이'
			showLabel
			bind:value={height}
			invalidClass='text-red-800'
			invalidText='이 값은 필수입니다.'
			required
		/>
		<div class='disabled-edit'>
			<p class='font-bold'>사용 불가 사물함 목록</p>
			<div class='flex items-center gap-2'>
				<NumberInput
					class='my-2'
					inputClass='w-full max-w-sm'
					id='disabled'
					label='사용 불가 사물함 목록'
					bind:value={disabledInput}
					invalidClass='hidden'
				/>
				<button
					on:click={addDisabled}
					class='transition-all rounded-md bg-gray-200 text-gray-500 hover:brightness-90 active:brightness-75'
				>
					<Add />
				</button>
			</div>
			{#if disabledInputInvalid}
				<p class='text-red-800'>{disabledInputInvalid}</p>
			{/if}
			<div class='py-3 flex flex-wrap gap-1'>
				{#each disabled as disabledId}
					<Tag
						on:click={() => removeDisabled(disabledId)}
						class='disabled-id bg-gray-300 select-none cursor-pointer hover:brightness-95 active:brightness-75'
					>
						<div class='flex items-center gap-1'>
							{disabledId}
							<Dismiss class='w-4 h-4 text-gray-500' />
						</div>
					</Tag>
				{/each}
			</div>
		</div>
		<div class='my-2'>
			<SubsectionSettings bind:subsections />
		</div>
	</div>
	<div class='actions-wrap'>
		<hr />
		<div class='flex justify-end gap-1 mt-3'>
			{#if !isNew}
				<Button
					on:click={removeSection}
					class='bg-red-800 text-white [&[disabled]]:opacity-[0.5]'
					isIconRight
				>
					삭제
					<Delete slot='icon' />
				</Button>
				<Button
					on:click={updateSection}
					disabled={isSaveDisabled}
					class='bg-primary-800 text-white [&[disabled]]:opacity-[0.5]'
					isIconRight
				>
					적용
					<Checkmark slot='icon' />
				</Button>
			{:else}
				<Button
					on:click={updateSection}
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
