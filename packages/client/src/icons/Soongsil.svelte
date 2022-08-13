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
        focusable: tabindex === '0' ? true : focusable,
        tabindex
    };
</script>
<svg
        on:click
        on:mouseover
        on:mouseenter
        on:mouseleave
        on:keyup
        on:keydown
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 257.67 108.53" width="16" height="16"
        class={className}
        preserveAspectRatio="xMidYMid meet"
        {style}
        {id}
        {...attributes}>
    <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
            <path class="cls-1"
                  d="M93.47,108.53H64c.34,0,1.41-1.44,1.68-1.71.57-.65,1.11-1.31,1.63-2a22.48,22.48,0,0,0,3-5.67c2.55-6.91,2.38-15-.48-21.14-3-6.45-7.65-12.1-10.92-17.44-5.31-8.68-9-18.41-8.25-28.76a32.92,32.92,0,0,1,7.95-18.68H87c-8,7.63-10.41,18.35-7.55,29.39C81,48.61,84.93,54.32,88,59c3.2,4.91,6.52,9.89,8.89,15.24a35.16,35.16,0,0,1,2.41,21A34.52,34.52,0,0,1,95.82,105C95.54,105.47,94.11,108.53,93.47,108.53Z"/>
            <path class="cls-2"
                  d="M109.84,80.67h48.95V0H94.37c-4.87,4.27-7.85,12.85-5.71,21.63,1.68,6.88,6.65,13.09,11.09,19,7,9.35,14.74,19.87,12.6,32.33A25.67,25.67,0,0,1,109.84,80.67Z"/>
            <path class="cls-3"
                  d="M0,0V80.67H48.17c2.31-5.17,1.46-11.23-.08-15-4.65-11.36-12.22-17.5-16.43-27.42-4-9.39-4.44-18-1-30.31a68.33,68.33,0,0,1,3.38-8Z"/>
            <path class="cls-1" d="M257.67,0h-40V64c0,.33-.06,1.88-.14,3.46-.45,10-2.8,12-5.3,13.23h45.44Z"/>
            <path class="cls-3" d="M169.67,13.2v80l0,1.29a13.23,13.23,0,0,0,26.43.27l0-1.56v-80Z"/>
        </g>
    </g>
</svg>

<style>
    .cls-1 {
        fill: #00a3c9;
    }

    .cls-2 {
        fill: #5ac5c4;
    }

    .cls-3 {
        fill: #00678f;
    }
</style>