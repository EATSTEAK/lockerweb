<script lang="ts">
  let className = undefined;
  export { className as class };
  export let id = undefined;
  export let tabindex = undefined;
  export let focusable = false;
  export let title = undefined;
  export let style = undefined;

  $: ariaLabel = $$props['aria-label'];
  $: ariaLabelledBy = $$props['aria-labelledby'];
  $: labelled = ariaLabel || ariaLabelledBy || title;
  $: attributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': labelled ? undefined : true,
    role: labelled ? 'img' : undefined,
    focusable: tabindex === '0' ? `${true}` : `${focusable}`,
    tabindex,
  };
</script>

<svg
  on:click
  on:focus
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:keyup
  on:keydown
  width="24"
  height="24"
  fill="none"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  {style}
  {id}
  {...attributes}>
  <path
    d="M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796Z"
    fill="currentColor" />
</svg>
