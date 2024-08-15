<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';

  let clazz = '';
  export { clazz as class };

  export let collapsable = false;

  export let collapsed = true;

  const collapsedState = writable<boolean>(collapsed);

  export let navClass = '';
  export let headerClass = '';

  let h: number = 0;
  let y: number = 0;
  let oldY: number = 0;
  let yDirection: number = 0;
  let hideNavbar = false;

  function calculateYDirection(yDiff: number) {
    if ((yDiff > 0 && yDirection < 0) || (yDiff < 0 && yDirection > 0)) yDirection = 0;
    else yDirection += yDiff;
  }

  $: if (collapsed !== $collapsedState) {
    collapsedState.set(collapsed);
  }

  $: {
    const yDiff = y - oldY;
    oldY = y;
    calculateYDirection(yDiff);
  }

  $: isOnTop = y <= 80;

  $: if (yDirection > 5) {
    hideNavbar = true;
  } else if (yDirection < -5) {
    hideNavbar = false;
  }

  setContext('Sidebar', {
    collapsed: collapsedState,
    set: (isCollapsed: boolean) => {
      collapsedState.set(isCollapsed);
      collapsed = isCollapsed;
    },
  });
</script>

<svelte:window bind:scrollY={y} />
{#if !collapsable || !hideNavbar || isOnTop || !collapsed}
  <!-- fly animation 시 header 아래로 nav 가 expand 되도록 element 의 순서를 바꾸고 `flex-col-reverse` 를 적용 -->
  <aside
    class="{clazz} z-40 flex max-h-screen flex-col-reverse justify-end overflow-y-auto"
    transition:fly={{ y: -100, duration: 500 }}
    class:fixed={collapsable}>
    {#if !collapsable || !collapsed}
      <nav
        transition:fly={{ y: -100, duration: 500 }}
        class="{navClass} flex grow flex-col overflow-y-auto bg-gray-200 px-6 shadow-md lg:px-10"
        class:mb-2={collapsable}>
        <slot />
      </nav>
    {/if}
    <section
      bind:clientHeight={h}
      class="{headerClass} bg-gray-200 px-6 transition-all lg:px-10"
      class:shadow-md={collapsable && collapsed}
      class:mb-2={collapsable && collapsed}>
      <slot name="header" />
    </section>
  </aside>
{/if}

<div style:margin-top={collapsable ? `${h}px` : '0'} />
