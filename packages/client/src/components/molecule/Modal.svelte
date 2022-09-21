<script lang="ts">
  import Button from '../atom/Button.svelte';
  import Dismiss from '../../icons/Dismiss.svelte';
  import { createEventDispatcher } from 'svelte';

  export let open: boolean = false;
  export let title: string;
  export let subtitle: string = '';
  export let noBackdrop: boolean = false;
  export let preventOutclick = false;

  export let primaryClass = '';
  export let secondaryClass = '';
  export let primaryText: string = '확인';
  export let secondaryText: string = '취소';
  export let isPrimaryBtnIconRight = false;
  export let isSecondaryBtnIconRight = false;
  export let primaryDisabled = false;
  export let secondaryDisabled = false;

  let clazz = '';
  export { clazz as class };

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;

  $: if (open) {
    if (!noBackdrop && dialog) dialog.showModal();
  } else {
    if (!noBackdrop && dialog) dialog.close();
  }

  function closeModal() {
    dispatch('close', {});
  }

  function click(btnType: 'primary' | 'secondary') {
    if (btnType === 'primary') {
      dispatch('click', {});
    } else if (btnType === 'secondary') {
      dispatch('click:secondary', {});
    }
  }

  function outClick(event: MouseEvent) {
    const rect = dialog.getBoundingClientRect();
    const doc = dialog.ownerDocument;
    const win = doc.defaultView || (doc as unknown as { parentWindow: Window }).parentWindow;
    if (event.view !== win || (event.clientX === 0 && event.clientY === 0)) return;
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!isInDialog && !preventOutclick) {
      // closeModal();
    }
  }
</script>

<dialog
  on:click={outClick}
  on:cancel
  on:cancel|preventDefault
  bind:this={dialog}
  {open}
  class="{clazz} fixed z-50
        my-4
        h-auto
        grow
        overflow-visible
        rounded-xl
        bg-gray-200
        p-0
        shadow-xl
        transition-all
        backdrop:bg-black
				backdrop:opacity-30 lg:w-[480px]"
  {...$$restProps}>
  <div
    class="flex h-full max-h-[calc(100vh-2rem)] w-full flex-col items-stretch gap-3 overflow-hidden rounded-xl">
    <div class="flex shrink-0 select-none justify-between">
      <div class="pl-4 pt-3 text-gray-700">
        <h4>{title}</h4>
        {#if subtitle}<h5>{subtitle}</h5>{/if}
      </div>
      <button
        on:click={closeModal}
        class="flex h-10 w-14 cursor-pointer items-center justify-center rounded-bl-2.5xl rounded-tr-xl bg-gray-300 text-center text-2xl transition-all hover:bg-primary-800 hover:text-white">
        <Dismiss />
      </button>
    </div>
    <div class="mx-4 my-2 h-auto grow overflow-y-auto overflow-x-visible">
      <slot />
    </div>
    <div class="mx-4 flex shrink-0 justify-end gap-3 pb-4">
      <slot name="actions">
        {#if $$slots.secondaryIcon}
          <Button
            on:click={() => click('secondary')}
            disabled={secondaryDisabled ? true : undefined}
            class="{secondaryClass} bg-gray-300 text-gray-600 hover:bg-gray-200 [&[disabled]]:opacity-50"
            isIconRight={isSecondaryBtnIconRight}>
            <slot slot="icon" name="secondaryIcon" />
            {secondaryText}
          </Button>
        {:else}
          <Button
            on:click={() => click('secondary')}
            disabled={secondaryDisabled ? true : undefined}
            class="{secondaryClass} bg-gray-300 text-gray-600 hover:bg-gray-200 [&[disabled]]:opacity-50"
            isIconRight={isSecondaryBtnIconRight}>
            {secondaryText}
          </Button>
        {/if}
        {#if $$slots.primaryIcon}
          <Button
            on:click={() => click('primary')}
            disabled={primaryDisabled ? true : undefined}
            class="{primaryClass} bg-primary-800 text-white [&[disabled]]:opacity-50"
            isIconRight={isPrimaryBtnIconRight}>
            <slot slot="icon" name="primaryIcon" />
            {primaryText}
          </Button>
        {:else}
          <Button
            on:click={() => click('primary')}
            disabled={primaryDisabled ? true : undefined}
            class="{primaryClass} bg-primary-800 text-white [&[disabled]]:opacity-50"
            isIconRight={isPrimaryBtnIconRight}>
            {primaryText}
          </Button>
        {/if}
      </slot>
    </div>
  </div>
</dialog>

<style lang="postcss">
  dialog[open] {
    animation: show 0.1s ease normal;
  }

  @keyframes show {
    from {
      transform: translateY(-5%);
      opacity: 0;
    }

    to {
      transform: translateY(0%);
      opacity: 1;
    }
  }
</style>
