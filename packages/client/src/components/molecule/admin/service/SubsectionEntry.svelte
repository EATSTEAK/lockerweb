<script lang="ts">
  import Subtract from '../../../../icons/Subtract.svelte';
  import { config } from '$lib/store';
  import NumberInput from '../../../atom/form/NumberInput.svelte';
  import Select from '../../../atom/form/Select.svelte';
  import { createEventDispatcher } from 'svelte';
  import isEqual from 'lodash.isequal';
  import { getDepartmentConfigs } from '$lib/api/config';

  export let key: string;
  export let subsection: LockerSubsection;

  const dispatch = createEventDispatcher<{
    remove: {};
    change: LockerSubsection;
  }>();

  $: departments = $config && $config.success ? getDepartmentConfigs($config.result) : [];

  let rangeStart = subsection?.range?.[0] ?? 0;
  let rangeEnd = subsection?.range?.[1] ?? 0;
  let department = subsection?.department;
  let invalidText: string;

  $: if (subsection) {
    initializeValues();
  }

  $: if (rangeStart && rangeEnd && department) {
    if (rangeStart <= 0) {
      invalidText = '값 무시됨: 구역 시작은 1보다 커야함';
    } else if (rangeStart > rangeEnd) {
      invalidText = '값 무시됨: 구역 시작이 끝보다 큼';
    } else if (!departments.find((d) => d.id === department)) {
      invalidText = '값 무시됨: 존재하지 않는 학과(부)';
    } else {
      invalidText = undefined;
      const newSubsection = {
        range: [rangeStart, rangeEnd],
        department,
      };
      if (!isEqual(subsection, newSubsection)) dispatch('change', newSubsection);
    }
  } else {
    invalidText = '값 무시됨: 모든 값이 입력되지 않음';
  }

  function initializeValues() {
    rangeStart = subsection?.range?.[0] ?? 0;
    rangeEnd = subsection?.range?.[1] ?? 0;
    department = subsection?.department;
    invalidText = undefined;
  }

  function removeSubsection() {
    dispatch('remove', {});
  }
</script>

<div class="flex flex-col gap-1 rounded-md bg-white transition-all hover:brightness-95">
  <div class="flex items-center gap-3 overflow-hidden p-1 transition-all">
    <div class="flex items-center">
      <button
        on:click={removeSubsection}
        class="rounded-md bg-gray-200 text-gray-500 transition-all hover:brightness-95 focus:brightness-90 active:brightness-75"
      >
        <Subtract />
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex flex-wrap items-center overflow-hidden rounded-md">
        <p class="mr-2 font-bold">세부 구역 범위</p>
        <div class="flex items-center">
          <NumberInput
            id="range-start"
            class="w-24"
            label="세부 구역 시작"
            bind:value={rangeStart}
          />
          <div class="p-2">~</div>
          <NumberInput id="range-end" class="w-24" label="세부 구역 끝" bind:value={rangeEnd} />
        </div>
      </div>
      <div class="flex flex-wrap items-center">
        <p class="mr-2 font-bold">대상 학과(부)</p>
        <Select
          id={`subsection_${key}_department`}
          label="대상 학과(부)"
          bind:value={department}
          required
        >
          {#each departments as department}
            <option value={department.id}>{department.name}</option>
          {/each}
        </Select>
      </div>
    </div>
  </div>
  {#if invalidText}
    <p class="text-red-800">{invalidText}</p>
  {/if}
</div>
