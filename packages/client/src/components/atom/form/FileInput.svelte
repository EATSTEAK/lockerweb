<script lang="ts">
  import Button from '../Button.svelte';
  import ArrowUpload from '../../../icons/ArrowUpload.svelte';
  import Document from '../../../icons/Document.svelte';

  export let id: string;
  export let files: FileList;
  export let label: string;
  export let multiple = false;
  export let showLabel: boolean = false;
  export let labelClass: string = '';
  export let inputClass: string = '';
  export let invalidClass: string = '';
  export let invalidText: string = '이 값은 올바르지 않습니다.';

  let ref: HTMLInputElement;
  let value: string;
  let clazz = '';
  export { clazz as class };

  function openFileDialog() {
    if (ref) ref.click();
  }
</script>

<div class="{clazz} flex flex-col">
  <!--suppress XmlInvalidId -->
  <label for={id} class="mb-1 block font-bold">
    <div class="flex flex-col">
      <p class={labelClass} hidden={!showLabel}>
        {label ?? ''} <span class:hidden={!$$props.required} class="text-red-800">*</span>
      </p>
      <Button class="bg-primary-800 text-white" isIconRight on:click={openFileDialog}>
        <ArrowUpload slot="icon" />
        {#if !multiple && files && files.length}
          다시 업로드
        {:else}
          파일 업로드
        {/if}
      </Button>
    </div>
  </label>
  <input
    bind:this={ref}
    {id}
    type="file"
    class="{inputClass} hidden"
    bind:files
    bind:value
    {...$$restProps} />
  {#if files}
    {#each files ?? [] as file}
      <div
        class="flex select-none flex-row items-center gap-1 rounded-xl bg-gray-300 p-1 text-sm text-gray-700">
        <Document class="h-5 w-5" />
        <div class="grow">{file.name}</div>
      </div>
    {/each}
  {/if}
  <p class={`invalid ${invalidClass}`}>{invalidText}</p>
</div>

<style lang="postcss">
  label > div > p[hidden] {
    @apply hidden;
  }

  label > div > p:not([hidden]) {
    @apply mb-1 block;
  }

  label ~ input:invalid {
    @apply outline-red-600;
  }

  input {
    @apply hidden;
  }

  label ~ input:hover {
    @apply brightness-95;
  }

  label ~ input:active {
    @apply brightness-75;
  }

  label ~ input:disabled {
    @apply bg-gray-300 text-gray-400;
  }

  p.invalid {
    @apply mt-1 hidden;
  }

  input:invalid ~ p {
    @apply block;
  }
</style>
