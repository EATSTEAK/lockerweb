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

<svg
	on:click
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
	{...attributes}
>
	<path
		d='M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z'
		fill='currentColor'
	/>
</svg>
