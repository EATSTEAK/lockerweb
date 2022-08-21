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
	<path
		d='M15 17.898c0 1.074-1.265 1.648-2.073.941l-6.31-5.522a1.75 1.75 0 0 1 0-2.634l6.31-5.522c.808-.707 2.073-.133 2.073.941v11.796Z'
		fill='currentColor' />
</svg>