<script lang="ts">
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

<div class="my-8 flex flex-col gap-3 lg:mx-8">
  <h3 class="mx-6 lg:mx-0">학과(부)별 설정</h3>
  {#if $config && $config.success && !updating}
    <div class="flex flex-col gap-3 bg-white p-6 shadow-md lg:rounded-md">
      <DepartmentConfigEditor on:delete={deleteDepartment} on:update={updateDepartment} {configs} />
    </div>
  {:else if updating}
    <UpdateScreen class="min-h-[32rem] lg:rounded-md" />
  {:else}
    <Skeleton class="h-[32rem] w-full grow bg-gray-200 lg:rounded-md" />
  {/if}
</div>
