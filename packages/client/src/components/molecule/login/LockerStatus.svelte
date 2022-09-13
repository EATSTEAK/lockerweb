<script lang="ts">
  import Tag from '../../atom/Tag.svelte';
  import DepartmentSelectionGroup from '../../atom/DepartmentSelectionGroup.svelte';
  import DepartmentSelection from '../../atom/DepartmentSelection.svelte';
  import DepartmentLockerStatus from './DepartmentLockerStatus.svelte';
  import Skeleton from '../../atom/Skeleton.svelte';
  import QuestionCircle from '../../../icons/QuestionCircle.svelte';
  import { fade } from 'svelte/transition';
  import type { LockerCount } from '$lib/types';

  export let lockerCount: LockerCount;

  let selectedDept: string;
  $: if (lockerCount && !selectedDept) {
    selectedDept = Object.keys(lockerCount)[0];
  }
  $: departmentStatus = selectedDept ? lockerCount[selectedDept] : undefined;
</script>

<div class="flex h-full flex-col gap-7">
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <h3>사물함 예약 현황</h3>
      <Tag class="bg-gray-200 text-primary-800"
        >{new Date().getMonth() + 1}/{new Date().getDate()}</Tag>
    </div>
    {#if lockerCount}
      <div transition:fade class="overflow-x-auto">
        <DepartmentSelectionGroup bind:selectedId={selectedDept}>
          {#each Object.entries(lockerCount) as [key, value] (key)}
            <DepartmentSelection
              id={key}
              departmentText={value.departmentName}
              lockerLeft={value.lockerLeft}
              totalLocker={value.totalLocker}
              activateFrom={value.activateFrom}
              activateTo={value.activateTo} />
          {/each}
        </DepartmentSelectionGroup>
      </div>
    {:else}
      <div class="flex gap-2 overflow-x-auto overflow-y-hidden py-2">
        <Skeleton
          class="h-[160px] w-[160px] shrink-0 grow-0 basis-[160px] rounded-2xl bg-gray-200" />
        <Skeleton
          class="h-[160px] w-[160px] shrink-0 grow-0 basis-[160px] rounded-2xl bg-gray-200" />
        <Skeleton
          class="h-[160px] w-[160px] shrink-0 grow-0 basis-[160px] rounded-2xl bg-gray-200" />
        <Skeleton
          class="h-[160px] w-[160px] shrink-0 grow-0 basis-[160px] rounded-2xl bg-gray-200" />
        <Skeleton
          class="h-[160px] w-[160px] shrink-0 grow-0 basis-[160px] rounded-2xl bg-gray-200" />
      </div>
    {/if}
  </div>
  <div class="grow">
    {#if departmentStatus}
      <div transition:fade>
        <DepartmentLockerStatus {departmentStatus} />
      </div>
    {:else if !lockerCount}
      <div class="flex flex-col gap-1">
        <Skeleton class="h-12 w-96 rounded-md bg-gray-200" />
        <Skeleton class="h-6 w-56 rounded-md bg-gray-200" />
      </div>
      <div class="mt-5">
        <Skeleton class="my-2 h-12 w-full rounded-2xl bg-gray-200" />
        <Skeleton class="my-2 h-12 w-full rounded-2xl bg-gray-200" />
        <Skeleton class="my-2 h-12 w-full rounded-2xl bg-gray-200" />
      </div>
    {:else}
      <div
        transition:fade
        class="flex h-full flex-col items-center justify-center rounded-md bg-primary-200 text-gray-700">
        <div class="flex flex-col items-start gap-1">
          <div class="flex flex-row items-center gap-2">
            <QuestionCircle class="h-16 w-16" />
            <h1>정보 없음</h1>
          </div>
          <p>예약 정보가 없습니다. 관리자라면 학과(부) 및 사물함 설정을 확인하세요.</p>
        </div>
      </div>
    {/if}
  </div>
</div>
