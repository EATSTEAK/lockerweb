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
		d='M8.5 13.25a.25.25 0 0 1 .25-.25H10v1.5H8.5v-1.25Zm0 2.75H10v1.5H8.75a.25.25 0 0 1-.25-.25V16Zm7 1.25V16h-4v1.5h3.75a.25.25 0 0 0 .25-.25Zm-4-4.25v1.5h4v-1.25a.25.25 0 0 0-.25-.25H11.5Zm.5-5V2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10h-6a2 2 0 0 1-2-2Zm-3.25 3.5h6.5c.966 0 1.75.784 1.75 1.75v4A1.75 1.75 0 0 1 15.25 19h-6.5A1.75 1.75 0 0 1 7 17.25v-4c0-.966.784-1.75 1.75-1.75ZM13.5 8V2.5l6 6H14a.5.5 0 0 1-.5-.5Z'
		fill='currentColor'
	/>
</svg>
