<script lang="ts">
  import Button from '../../../atom/Button.svelte';
  import SaveEdit from '../../../../icons/SaveEdit.svelte';
  import TextInput from '../../../atom/form/TextInput.svelte';
  import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
  import Add from '../../../../icons/Add.svelte';
  import isEqual from 'lodash.isequal';
  import { createEventDispatcher } from 'svelte';
  import Delete from '../../../../icons/Delete.svelte';

  export let original: DepartmentConfig;
  export let isNew = false;

  const dispatch = createEventDispatcher<{
    delete: ConfigDeleteRequest;
    update: DepartmentConfigUpdateRequest;
  }>();

  let id: string;
  let name: string;
  let activateFrom: Date;
  let activateTo: Date;
  let contact: string;

  function initializeValues() {
    id = original?.id ?? '';
    name = original?.name ?? '';
    activateFrom = (original?.activateFrom as Date) ?? null;
    activateTo = (original?.activateTo as Date) ?? null;
    contact = original?.contact ?? '';
  }

  $: if (original || isNew) initializeValues();

  $: newConfig = {
    id,
    name,
    ...(activateFrom
      ? { activateFrom: activateFrom.toISOString() }
      : original?.activateFrom && { activateFrom: null }),
    ...(activateTo
      ? { activateTo: activateTo.toISOString() }
      : original?.activateTo && { activateTo: null }),
    ...(contact ? { contact } : original?.contact && { contact: null }),
  };

  $: isModified = !isEqual(original, newConfig);

  const isNotAlphabet = new RegExp('\\W+');
  $: isAppliable = id && name && !isNotAlphabet.test(id);
  $: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

  function deleteDepartment() {
    dispatch('delete', { id });
  }

  function updateDepartment() {
    dispatch('update', newConfig);
  }
</script>

<div class="flex h-full flex-col justify-between p-3">
  <div class="mb-3 flex flex-col">
    {#if isNew}
      <h4>새 학과(부) 추가</h4>
    {:else}
      <h4>{original.name} 수정</h4>
    {/if}
    <TextInput
      class="my-2"
      inputClass="w-full max-w-sm"
      id="id"
      label="학과(부) ID"
      showLabel
      disabled={!isNew}
      bind:value={id}
      required={isNew}
      pattern="\w+"
      invalidClass="text-red-800"
      invalidText={id ? 'ID는 알파벳 혹은 _ 만 허용됩니다.' : '이 값은 필수입니다.'}
    />
    <TextInput
      class="my-2"
      inputClass="w-full max-w-sm"
      id="name"
      label="학과(부) 이름"
      showLabel
      bind:value={name}
      required
      invalidClass="text-red-800"
      invalidText="이 값은 필수입니다."
    />
    <DateTimeInput
      class="my-2"
      inputClass="w-full max-w-sm"
      id="activate_from"
      label="예약 시작일"
      showLabel
      bind:value={activateFrom}
      invalidClass="text-red-800"
    />
    <DateTimeInput
      class="my-2"
      inputClass="w-full max-w-sm"
      id="activate_to"
      label="예약 종료일"
      showLabel
      bind:value={activateTo}
      invalidClass="text-red-800"
    />
    <TextInput
      class="my-2"
      inputClass="w-full max-w-sm"
      id="contact"
      label="학과(부) 연락처"
      showLabel
      bind:value={contact}
    />
  </div>
  <div class="actions-wrap">
    <hr />
    <div class="mt-3 flex justify-end gap-1">
      {#if !isNew}
        <Button on:click={deleteDepartment} class="bg-red-800 text-white" isIconRight>
          삭제
          <Delete slot="icon" />
        </Button>
      {/if}
      {#if !isNew}
        <Button
          disabled={isSaveDisabled}
          on:click={updateDepartment}
          class="bg-primary-800 text-white [&[disabled]]:bg-primary-400"
          isIconRight
        >
          저장
          <SaveEdit slot="icon" />
        </Button>
      {:else}
        <Button
          disabled={isSaveDisabled}
          on:click={updateDepartment}
          class="bg-primary-800 text-white [&[disabled]]:bg-primary-400"
          isIconRight
        >
          추가
          <Add slot="icon" />
        </Button>
      {/if}
    </div>
  </div>
</div>
