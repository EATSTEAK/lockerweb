<script lang="ts">
  import Tag from '../atom/Tag.svelte';
  import { getDepartmentNameById } from '$lib/utils';
  import { config } from '$lib/store';
  import Skeleton from '../atom/Skeleton.svelte';

  export let user: User;

  $: configs = $config && $config.success && $config.result;
</script>

{#if user}
  <div class="flex flex-col items-start gap-1">
    <p class="font-semibold leading-5">반갑습니다!</p>
    <p class="font-semibold leading-5">
      <span class="text-5xl font-bold text-primary-800">{user?.name ?? '알 수 없음'}</span>님
    </p>
    <Tag class="bg-gray-300 text-gray-700"
      >학과(부) \ {getDepartmentNameById(configs ?? [], user.department) ?? '알 수 없음'}</Tag>
    <Tag class="bg-gray-300 text-gray-700">학번 \ {user.id}</Tag>
  </div>
{:else}
  <div class="flex flex-col items-start gap-1">
    <div class="flex flex-row gap-3">
      <Skeleton class="h-20 w-20 rounded-full bg-gray-300" />
      <div class="flex flex-col gap-2">
        <Skeleton class="h-7 w-28 rounded-lg bg-gray-300" />
        <Skeleton class="h-10 w-36 rounded-lg bg-gray-300" />
      </div>
    </div>
  </div>
{/if}
