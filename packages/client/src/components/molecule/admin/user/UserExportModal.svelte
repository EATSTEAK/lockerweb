<script lang='ts'>
	import Modal from '../../Modal.svelte';
	import Dismiss from '../../../../icons/Dismiss.svelte';
	import { config } from '$lib/store';
	import Select from '../../../atom/form/Select.svelte';
	import Checkbox from '../../../atom/form/Checkbox.svelte';
	import DocumentArrowLeft from '../../../../icons/DocumentArrowLeft.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getDepartmentConfigs } from '$lib/api/config';

	const dispatch = createEventDispatcher<{
		submit: { department: string; reservedOnly: boolean };
	}>();

	$: departments = $config && $config.success ? getDepartmentConfigs($config.result) : [];

	export let open = false;

	const title = '사용자 내보내기';
	let department = 'all';
	let reservedOnly = false;

	function closeModal() {
		open = false;
	}

	function exportUsers() {
		dispatch('submit', { department, reservedOnly });
	}
</script>

<Modal
	on:close
	on:click:secondary={closeModal}
	on:click={exportUsers}
	{title}
	bind:open
	primaryText='내보내기'
	isPrimaryBtnIconRight
	isSecondaryBtnIconRight
	{...$$restProps}
>
	<div class='flex flex-col gap-3'>
		<Select
			id='department'
			label='대상 학부'
			showLabel
			bind:value={department}
			required
			invalidText='이 값은 필수입니다.'
			invalidClass='text-red-800'
		>
			<option value='all'>전체</option>
			{#each departments as department}
				<option value={department.id}>{department.name}</option>
			{/each}
		</Select>
		<Checkbox
			id='reserved_only'
			bind:checked={reservedOnly}
			label='사물함을 예약한 사람만 내보내기'
			showLabel
		/>
	</div>
	<DocumentArrowLeft slot='primaryIcon' />
	<Dismiss slot='secondaryIcon' />
</Modal>
