<script lang='ts'>
  import Tag from '../atom/Tag.svelte';
  import { getDepartmentNameById } from '$lib/utils';
  import { config } from '$lib/store';
	import Skeleton from "../atom/Skeleton.svelte";

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
		<div class="skeleton-wrap gap-3">
			<Skeleton class="w-20 h-20 rounded-full bg-gray-300"/>
			<div class="flex flex-col gap-2">
				<Skeleton class="w-28 h-7 rounded-lg bg-gray-300"/>
				<Skeleton class="w-36 h-10 rounded-lg bg-gray-300"/>
			</div>
		</div>
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

		.skeleton-wrap {
			@apply flex flex-row;
		}
</style>


