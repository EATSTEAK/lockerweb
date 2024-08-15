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
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 22.2C17.6333 22.2 22.2 17.6333 22.2 12C22.2 6.3667 17.6333 1.8 12 1.8C6.3667 1.8 1.8 6.3667 1.8 12C1.8 17.6333 6.3667 22.2 12 22.2ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
    fill="currentColor" />
  <path
    d="M17.174 7.07532L5.29871 9.56882C4.77508 9.86804 4.85196 10.2961 4.95586 10.4727C5.37144 10.9195 5.85975 11.439 6.17144 11.7195C6.25007 11.7902 6.35845 11.9065 6.63897 11.9065C9.93248 11.2312 16.5756 9.86804 16.8 9.81817C17.0244 9.7683 17.0598 9.63116 17.0494 9.56882C17.2156 9.15324 17.5855 8.20363 17.7351 7.72986C17.76 7.23116 17.3714 7.08571 17.174 7.07532Z"
    fill="currentColor" />
  <path
    d="M16.4572 10.7221L13.8078 11.2831C13.5585 11.3359 13.413 11.4921 13.3714 11.5636L11.5325 16.3325C11.4805 16.4571 11.3829 16.7377 11.4078 16.8623C11.4327 16.987 11.4805 17.0597 11.5013 17.0805L12.7792 18.3584C13.2156 18.7948 13.6831 18.7325 13.9375 18.2649C14.1918 17.7974 16.6392 11.2733 16.7377 11.0026C16.7377 10.7782 16.5507 10.7221 16.4572 10.7221Z"
    fill="currentColor" />
  <path
    d="M12.0935 11.626L7.20001 12.6234C6.9756 12.7231 7.1065 12.8935 7.20001 12.9662C8.18702 13.9636 10.1985 15.9958 10.3481 16.1454C10.4977 16.2951 10.639 16.1454 10.6909 16.0519C11.2104 14.7428 12.2681 12.0686 12.3429 11.8441C12.4177 11.6197 12.2078 11.6052 12.0935 11.626Z"
    fill="currentColor" />
</svg>
