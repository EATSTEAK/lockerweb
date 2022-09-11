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
		 on:focus
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
		d='M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm-.004 8.25a1 1 0 0 0-.992.885l-.007.116.003 5.502.007.117a1 1 0 0 0 1.987-.002L13 16.75l-.003-5.501-.007-.117a1 1 0 0 0-.994-.882ZM12 6.5a1.251 1.251 0 1 0 0 2.503A1.251 1.251 0 0 0 12 6.5Z'
		fill='currentColor' />
</svg>