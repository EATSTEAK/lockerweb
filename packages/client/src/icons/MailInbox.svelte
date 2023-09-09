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
    d="M17.75 3A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5Zm0 1.5H6.25A1.75 1.75 0 0 0 4.5 6.25V13H9a.75.75 0 0 1 .743.648l.007.102a2.25 2.25 0 0 0 4.5 0A.75.75 0 0 1 15 13h4.5V6.25a1.75 1.75 0 0 0-1.607-1.744L17.75 4.5Z"
    fill="currentColor" />
</svg>
