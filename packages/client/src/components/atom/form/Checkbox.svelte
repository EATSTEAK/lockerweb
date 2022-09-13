<script lang="ts">
  export let id: string;
  export let checked: boolean;
  export let label: string = null;
  export let showLabel: boolean = false;
  export let labelClass: string = '';
  export let inputClass: string = '';
  let clazz = '';
  export { clazz as class };
</script>

<div class="{clazz} flex flex-col">
  <!--suppress XmlInvalidId -->
  <label class="{labelClass} mb-1 block font-bold" for={id} class:hidden={!showLabel}
    >{label ?? ''}</label>
  <input
    {id}
    type="checkbox"
    on:change
    on:input
    class="{inputClass} rounded-md transition-all"
    bind:checked
    {...$$restProps} />
</div>

<style lang="postcss">
  input:not(:checked) {
    @apply border-gray-400 bg-gray-100;
  }

  input:checked {
    @apply bg-primary-800 text-white;
  }

  input:checked:hover {
    @apply bg-primary-800;
  }

  input:checked:active {
    @apply bg-primary-800;
  }

  input:checked:focus {
    @apply bg-primary-800 outline-0;
  }

  input:hover:not(:disabled) {
    @apply scale-101 brightness-90;
  }

  input:focus {
    @apply scale-100 outline-0 brightness-90;
  }

  input:active:not(:disabled) {
    @apply brightness-75;
  }

  input:disabled:not(:checked) {
    @apply bg-gray-300 text-gray-400;
  }

  input:disabled:checked {
    @apply bg-primary-500 text-gray-400;
  }
</style>
