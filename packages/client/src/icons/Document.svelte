<script lang='ts'>
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
		focusable: tabindex === '0' ? true : focusable,
		tabindex
	};
</script>
<svg on:click
		 on:mouseover
		 on:mouseenter
		 on:mouseleave
		 on:keyup
		 on:keydown
		 width='24'
		 height='24'
		 fill='none'
		 viewBox='0 0 24 24'
		 xmlns='http://www.w3.org/2000/svg'
		 class={className}
		 {style}
		 {id}
		 {...attributes}>
	<path d='M12 2v6a2 2 0 0 0 2 2h6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6Z' fill='currentColor' />
	<path d='M13.5 2.5V8a.5.5 0 0 0 .5.5h5.5l-6-6Z' fill='currentColor' />
</svg>