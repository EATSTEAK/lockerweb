<script lang='ts'>
	import { config } from '$lib/store';
	import UpdateScreen from '../../../atom/UpdateScreen.svelte';
	import DepartmentConfigEditor from './DepartmentConfigEditor.svelte';
	import Skeleton from '../../../atom/Skeleton.svelte';
	import { apiDeleteConfig, apiUpdateConfig, getDepartmentConfigs } from '$lib/api/config';

	$: configs = $config && $config.success ? getDepartmentConfigs($config.result) : [];

	let updating = false;
	$: if ($config) updating = false;

	function deleteDepartment(event: CustomEvent<ConfigDeleteRequest>) {
		updating = true;
		apiDeleteConfig(event.detail)
			.then((res) => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error((res as ErrorResponse<LockerError>).error);
				}
			})
			.catch((err) => {
				console.error(err);
				updating = false;
			});
	}

	function updateDepartment(event: CustomEvent<ConfigUpdateRequest>) {
		updating = true;
		apiUpdateConfig(event.detail)
			.then((res) => {
				updating = false;
				if (res.success) {
					config.refresh();
				} else {
					console.error((res as ErrorResponse<LockerError>).error);
				}
			})
			.catch((err) => {
				console.error(err);
				updating = false;
			});
	}
</script>

<div class='my-8 md:mx-8 flex flex-col gap-3'>
	<h3 class='mx-6 md:mx-0'>학과(부)별 설정</h3>
	{#if $config && $config.success && !updating}
		<div class='md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3'>
			<DepartmentConfigEditor on:delete={deleteDepartment} on:update={updateDepartment} {configs} />
		</div>
	{:else if updating}
		<UpdateScreen class='min-h-[32rem] md:rounded-md' />
	{:else}
		<Skeleton class='w-full h-[32rem] grow md:rounded-md bg-gray-200' />
	{/if}
</div>
