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
	<rect x='0.113953' y='21.726' width='29.4924' height='1.63847' rx='0.819234' transform='rotate(-45 0.113953 21.726)'
				fill='currentColor' />
	<rect x='7.39844' y='11.2554' width='16.3847' height='1.63847' rx='0.819234' transform='rotate(-45 7.39844 11.2554)'
				fill='currentColor' />
	<rect x='8.12256' y='7.34521' width='9.83081' height='1.63847' rx='0.819234' transform='rotate(-45 8.12256 7.34521)'
				fill='currentColor' />
	<rect x='14.4947' y='13.7174' width='9.83081' height='1.63847' rx='0.819234' transform='rotate(-45 14.4947 13.7174)'
				fill='currentColor' />
	<rect x='10.5845' y='14.4415' width='16.3847' height='1.63847' rx='0.819234' transform='rotate(-45 10.5845 14.4415)'
				fill='currentColor' />
	<rect x='2.86554' y='22.1604' width='3.27694' height='1.63847' rx='0.819234' transform='rotate(-45 2.86554 22.1604)'
				fill='currentColor' />
	<rect x='-0.320557' y='18.9744' width='3.27694' height='1.63847' rx='0.819234'
				transform='rotate(-45 -0.320557 18.9744)' fill='currentColor' />
</svg>
