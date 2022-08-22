<script lang='ts'>
	import { config } from '$lib/store';
	import DepartmentConfigEditor from '../department/DepartmentConfigEditor.svelte';
	import { fetchWithAuth } from '$lib/auth';
	import { variables } from '$lib/variables';

	$: configs = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];

	function deleteDepartment(event: CustomEvent<ConfigDeleteRequest>) {
		fetchWithAuth(variables.baseUrl + '/api/v1/config/delete', {
			method: 'POST',
			body: JSON.stringify(event.detail)
		}).then(res => res.json())
			.then(res => {
				if (res.success) {
					config.refresh();
				} else {
					console.error(res.errorDescription);
				}
			})
			.catch(err => console.error(err));
	}

	function updateDepartment(event: CustomEvent<ConfigUpdateRequest>) {
		fetchWithAuth(variables.baseUrl + '/api/v1/config/update', {
			method: 'POST',
			body: JSON.stringify(event.detail)
		}).then(res => res.json())
			.then(res => {
				if (res.success) {
					config.refresh();
				} else {
					console.error(res.errorDescription);
				}
			})
			.catch(err => console.error(err));
	}
</script>

<div class='wrap'>
	<h3 class='title'>학부별 설정</h3>
	<div class='card'>
		<DepartmentConfigEditor on:delete={deleteDepartment} on:update={updateDepartment} {configs} />
	</div>
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
</style>