<script lang='ts'>

	import { createEventDispatcher } from 'svelte';
	import Modal from '../../Modal.svelte';
	import PeopleTeamAdd from '../../../../icons/PeopleTeamAdd.svelte';
	import Dismiss from '../../../../icons/Dismiss.svelte';
	import { config } from '$lib/store';
	import Select from '../../../atom/form/Select.svelte';
	import FileInput from '../../../atom/form/FileInput.svelte';

	const dispatch = createEventDispatcher<{ submit: User[] }>();

	$: departments = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];

	export let open = false;

	const title = '사용자 가져오기';
	let department = null;
	let files = [];

	let users: User[]; // TODO: Reactive by files and workbook

	function closeModal() {
		open = false;
	}

	function submitUsers() {
		if (users) dispatch('submit', users);
		console.log('Importing users');
	}
</script>

<Modal on:close on:click:secondary={closeModal} on:click={submitUsers} {title} bind:open primaryText='업로드'
			 isPrimaryBtnIconRight isSecondaryBtnIconRight {...$$restProps}>
	<div class='wrap'>
		<Select id={`department`} label='업로드 대상 학부' showLabel bind:value={department} required invalidText='이 값은 필수입니다.'
						invalidClass='text-red-800'>
			{#each departments as department}
				<option value={department.id}>{department.name}</option>
			{/each}
		</Select>
		<FileInput id='import_file' label='사용자 목록 업로드' showLabel bind:files required invalidText='이 값은 필수입니다.'
							 invalidClass='text-red-800'
							 accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' />
	</div>
	<PeopleTeamAdd slot='primaryIcon' />
	<Dismiss slot='secondaryIcon' />
</Modal>

<style>
    .wrap {
        @apply flex flex-col gap-3;
    }
</style>