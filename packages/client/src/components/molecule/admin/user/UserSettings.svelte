<script lang='ts'>
	import UserDatatable from './UserDatatable.svelte';
	import { variables } from '$lib/variables';
	import { browser } from '$app/env';
	import { fetchWithAuth } from '$lib/auth';

	let userPromise: Promise<Array<User>>;
	if (browser) {
		userPromise = fetchWithAuth(variables.baseUrl + '/api/v1/user/query').then((res) => res.json())
			.then((res) => {
				if (res.success) {
					return res.result;
				}
				throw new Error(res.errorDescription);
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<div class='wrap'>
	<h3 class='title'>사용자 설정</h3>
	{#await userPromise}
		로드중
	{:then users}
		<div class='table'>
			<UserDatatable {users} />
		</div>
	{:catch err}
	{/await}
</div>

<style>
    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3 h-full;
    }

    .title {
        @apply mx-6 md:mx-0;

    }

    .table {
        @apply grow overflow-scroll;
    }
</style>