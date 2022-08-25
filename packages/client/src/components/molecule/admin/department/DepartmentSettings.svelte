<script lang='ts'>
	import { config } from '$lib/store';
	import { fetchWithAuth } from '$lib/auth';
	import { variables } from '$lib/variables';
	import UpdateScreen from '../../../atom/UpdateScreen.svelte';
	import DepartmentConfigEditor from './DepartmentConfigEditor.svelte';
	import Skeleton from "../../../atom/Skeleton.svelte";

	$: configs = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];

	let updating = false;
	$: if ($config) updating = false;

	function deleteDepartment(event: CustomEvent<ConfigDeleteRequest>) {
		updating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/config/delete', {
			method: 'POST',
			body: JSON.stringify(event.detail)
		}).then(res => res.json())
			.then(res => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error(res.errorDescription);
				}
			})
			.catch(err => {
				console.error(err);
				updating = false;
			});
	}

	function updateDepartment(event: CustomEvent<ConfigUpdateRequest>) {
		updating = true;
		fetchWithAuth(variables.baseUrl + '/api/v1/config/update', {
			method: 'POST',
			body: JSON.stringify(event.detail)
		}).then(res => res.json())
			.then(res => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error(res.errorDescription);
				}
			})
			.catch(err => {
				console.error(err);
				updating = false;
			});
	}
</script>

<div class='wrap'>
	<h3 class='title'>학부별 설정</h3>
	{#if $config && !updating}
		<div class='card'>
			<DepartmentConfigEditor on:delete={deleteDepartment} on:update={updateDepartment} {configs} />
		</div>
	{:else if updating}
		<UpdateScreen class='min-h-[32rem] md:rounded-md' />
	{:else}
		<Skeleton class='card-placeholder'></Skeleton>
	{/if}
</div>

<style>
    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3;
    }

    .title {
        @apply mx-6 md:mx-0;
    }

    .card {
        @apply md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3;
    }

    :global(.card-placeholder) {
        @apply w-full h-[32rem] grow md:rounded-md bg-gray-200;
    }
</style>