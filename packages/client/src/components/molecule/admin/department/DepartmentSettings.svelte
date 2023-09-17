<script lang="ts">
  import { config } from '$lib/store';
  import UpdateScreen from '../../../atom/UpdateScreen.svelte';
  import DepartmentConfigEditor from './DepartmentConfigEditor.svelte';
  import Skeleton from '../../../atom/Skeleton.svelte';
  import { apiDeleteConfig, apiUpdateConfig, getDepartmentConfigs } from '$lib/api/config';
  import Code from '../../../../icons/Code.svelte';
  import DepartmentImportExportModal from './DepartmentImportExportModal.svelte';
  import Button from '../../../atom/Button.svelte';

  $: configs = $config && $config.success ? getDepartmentConfigs($config.result) : [];

  let updating = false;
  $: if ($config) updating = false;
  let importExportModalOpen = false;

  function openImportExportModal() {
    importExportModalOpen = true;
  }

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

  function importDepartmentConfigs(event: CustomEvent<DepartmentConfigResponse[]>) {
    importExportModalOpen = false;
    const importedConfig = event.detail;
    updating = true;
    const updatePromises = importedConfig.map((conf) => apiUpdateConfig(conf as DepartmentConfigUpdateRequest).then((res) => {
        if(res.success == false) {
          throw (res as ErrorResponse<LockerError>).error;
        }
        return true;
      }));
    Promise.all(updatePromises)
      .then(() => {
        updating = false;
        config.refresh();
      })
      .catch((err) => {
        console.error(err);
        updating = false;
      });
  }
</script>

<div class="my-8 flex w-auto flex-col item-stretch gap-3 lg:mx-8">
  <div class="mx-6 flex w-full flex-wrap lg:mx-0">
    <h3>학과(부)별 설정</h3>
    {#if !updating}
      <div class="flex grow items-center justify-end gap-1">
        <Button on:click={openImportExportModal} class="bg-gray-200 text-gray-700" isIconRight>
          <Code slot="icon" />
        </Button>
      </div>
    {/if}
  </div>
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

<DepartmentImportExportModal
  bind:open={importExportModalOpen}
  on:close={() => (importExportModalOpen = false)}
  on:submit={importDepartmentConfigs} />
