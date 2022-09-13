<script lang="ts">
  import BuildingEditor from './BuildingEditor.svelte';
  import TextInput from '../../../atom/form/TextInput.svelte';
  import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
  import Button from '../../../atom/Button.svelte';
  import SaveEdit from '../../../../icons/SaveEdit.svelte';
  import ArrowUndo from '../../../../icons/ArrowUndo.svelte';
  import isEqual from 'lodash.isequal';
  import { apiUpdateConfig, getServiceConfig } from '$lib/api/config';
  import { config } from '$lib/store';
  import UpdateScreen from '../../../atom/UpdateScreen.svelte';
  import Warning from '../../../../icons/Warning.svelte';
  import Skeleton from '../../../atom/Skeleton.svelte';

  $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

  $: isServiceReady = !!(
    $config &&
    $config.success &&
    $config.result.find((v) => v.id === 'SERVICE')
  );

  let updating = false;

  let name: string;
  let activateFrom: Date;
  let activateTo: Date;
  let alert: string;
  let buildings: { [buildingNum: string]: Building };

  $: if (serviceConfig) {
    initializeValues();
    updating = false;
  }

  $: newConfig = {
    id: 'SERVICE',
    name,
    ...(activateFrom
      ? { activateFrom: activateFrom.toISOString() }
      : serviceConfig?.activateFrom && { activateFrom: null }),
    ...(activateTo
      ? { activateTo: activateTo.toISOString() }
      : serviceConfig?.activateTo && { activateTo: null }),
    ...(alert ? { alert } : serviceConfig?.alert && { alert: null }),
    buildings,
  };
  $: isModified = !!serviceConfig && !isEqual(serviceConfig, newConfig);

  $: isAppliable = isModified && name;

  $: isSaveDisabled = !isModified || !isAppliable ? true : undefined;

  $: isBuildingModified = !isEqual(serviceConfig?.buildings ?? {}, buildings);

  function initializeValues() {
    name = serviceConfig?.name ?? '';
    activateFrom = serviceConfig?.activateFrom ?? null;
    activateTo = serviceConfig?.activateTo ?? null;
    buildings = structuredClone(serviceConfig?.buildings ?? {});
    alert = serviceConfig?.alert ?? null;
  }

  function updateConfig() {
    updating = true;
    apiUpdateConfig(newConfig)
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

<div class="my-8 flex flex-col gap-3 lg:mx-8">
  <div class="mx-6 flex flex-wrap items-start lg:mx-0">
    <h3>서비스 설정</h3>
    <div class="flex grow justify-end gap-1">
      <Button
        on:click={initializeValues}
        disabled={!isModified ? true : undefined}
        class="bg-white text-gray-700 [&[disabled]]:opacity-50"
        isIconRight>
        되돌리기
        <ArrowUndo slot="icon" />
      </Button>
      <Button
        on:click={updateConfig}
        disabled={isSaveDisabled}
        class="bg-primary-800 text-white [&[disabled]]:opacity-50"
        isIconRight>
        저장
        <SaveEdit slot="icon" />
      </Button>
    </div>
  </div>
  {#if serviceConfig && !isServiceReady}
    <div class="flex gap-3 rounded-md bg-red-300 p-6">
      <Warning />
      <div class="grow">
        <span class="font-bold">주의:</span> 현재 서비스가 설정되지 않은 상태입니다. 서비스 이름을 포함한
        설정을 저장하여 설정해 주세요.
      </div>
    </div>
  {/if}
  {#if updating}
    <UpdateScreen class="min-h-[32rem] lg:rounded-md" />
  {:else}
    <section class="flex flex-col gap-3 bg-white p-6 shadow-md lg:rounded-md">
      <h4>전체 서비스 설정</h4>
      <div class="service">
        {#if serviceConfig}
          <TextInput
            class="my-2"
            inputClass="w-full max-w-sm"
            id="name"
            label="서비스 이름"
            showLabel
            bind:value={name}
            required
            invalidClass="text-red-800"
            invalidText="이 값은 필수입니다." />
          <DateTimeInput
            class="my-2"
            inputClass="w-full max-w-sm"
            id="activate_from"
            label="예약 시작일"
            showLabel
            bind:value={activateFrom}
            invalidClass="text-red-800" />
          <DateTimeInput
            class="my-2"
            inputClass="w-full max-w-sm"
            id="activate_to"
            label="예약 종료일"
            showLabel
            bind:value={activateTo}
            invalidClass="text-red-800" />
          <TextInput
            class="my-2"
            inputClass="w-full max-w-sm"
            id="name"
            label="공지사항"
            showLabel
            bind:value={alert} />
        {:else}
          <div class="my-2 flex flex-col gap-1">
            <Skeleton class="h-4 w-24 bg-gray-200 lg:rounded-md" />
            <Skeleton class="h-8 w-96 bg-gray-200 lg:rounded-md" />
          </div>
          <div class="my-2 flex flex-col gap-1">
            <Skeleton class="h-4 w-24 bg-gray-200 lg:rounded-md" />
            <Skeleton class="h-8 w-96 bg-gray-200 lg:rounded-md" />
          </div>
          <div class="my-2 flex flex-col gap-1">
            <Skeleton class="h-4 w-24 bg-gray-200 lg:rounded-md" />
            <Skeleton class="h-8 w-96 bg-gray-200 lg:rounded-md" />
          </div>
          <div class="my-2 flex flex-col gap-1">
            <Skeleton class="h-4 w-24 bg-gray-200 lg:rounded-md" />
            <Skeleton class="h-8 w-96 bg-gray-200 lg:rounded-md" />
          </div>
        {/if}
      </div>
    </section>
    <section class="flex flex-col gap-3 bg-white p-6 shadow-md lg:rounded-md">
      <h4>건물/사물함 수정</h4>
      {#if serviceConfig && isBuildingModified}
        <div class="flex gap-3 rounded-md bg-primary-200 p-6">
          <Warning />
          <div class="grow">
            <span class="font-bold">주의:</span> 변경된 건물 정보가 저장되지 않았습니다. 편집을
            완료한 이후 우상단 <span class="font-bold">저장</span>
            버튼을 눌러 저장하였는지 확인하세요.
          </div>
        </div>
      {/if}
      {#if serviceConfig}
        <BuildingEditor bind:buildings />
      {:else}
        <Skeleton class="min-h-[32rem] w-full bg-gray-200 lg:rounded-md" />
      {/if}
    </section>
  {/if}
</div>
