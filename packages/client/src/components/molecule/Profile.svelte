<script lang='ts'>
  import Tag from '../atom/Tag.svelte';
  import { getDepartmentNameById } from '$lib/utils';
  import { config } from '$lib/store';

  export let user: User;
</script>
{#if user}
	<div class='profile'>
		<p>반갑습니다!</p>
		<p><span class='name'>{user?.name ?? '알 수 없음'}</span>님</p>
		<Tag class='bg-gray-300 text-gray-700'>학부 \ {getDepartmentNameById($config, user.department)}</Tag>
		<Tag class='bg-gray-300 text-gray-700'>학번 \ {user.id}</Tag>
	</div>
{:else}
	<div class='profile'>
		로딩중
	</div>
{/if}

<style>

    .profile {
        @apply flex flex-col items-start gap-1;
    }

    p {
        @apply font-semibold leading-5;
    }

    .name {
        @apply text-5xl font-bold text-primary-800;
    }
</style>


