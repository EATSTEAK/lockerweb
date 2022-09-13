<script lang="ts">
  import { onMount } from 'svelte';

  export let id: string;
  export let value: Date | undefined;
  export let label: string;
  export let showLabel: boolean = false;
  export let labelClass: string = '';
  export let inputClass: string = '';
  export let invalidClass: string = '';
  export let invalidText: string = '이 값은 올바르지 않습니다.';
  let clazz = '';
  export { clazz as class };

  let localDate: string;
  let mounted = false;

  onMount(() => {
    localDate = value
      ? new Date(value.getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, -1)
      : undefined;
    mounted = true;
  });

  $: if (mounted) {
    if (localDate) {
      value = new Date(localDate);
    } else {
      value = null;
    }
  }
</script>

<div class="{clazz} flex flex-col">
  <!--suppress XmlInvalidId -->
  <label class="{labelClass} mb-1 block font-bold" for={id} class:hidden={!showLabel}
    >{label ?? ''} <span class:hidden={!$$props.required} class="text-red-800">*</span></label
  >
  <input
    {id}
    type="datetime-local"
    class="{inputClass} rounded-md border-transparent bg-gray-100 transition-all
				 		hover:bg-gray-200 focus:bg-white
						disabled:bg-gray-300 disabled:text-gray-400"
    bind:value={localDate}
    {...$$restProps}
  />
  <p class="{invalidClass} mt-1 hidden">{invalidText}</p>
</div>

<style lang="postcss">
  input:invalid ~ p {
    @apply block;
  }
</style>
