<script lang='ts'>
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

	let dialog;

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
		const win = doc.defaultView || doc.parentWindow;
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
	class='{clazz} grow bg-gray-200
        rounded-xl
        fixed
        p-0
        my-4
        z-50
        overflow-visible
        transition-all
        shadow-xl
        md:w-[480px]
				backdrop:bg-black backdrop:opacity-30'
	{...$$restProps}
>
	<div class='flex flex-col items-stretch gap-3 w-full h-full max-h-[calc(100vh-2rem)] rounded-xl overflow-hidden'>
		<div class='flex justify-between select-none shrink-0'>
			<div class='pl-4 pt-3 text-gray-700'>
				<h4>{title}</h4>
				{#if subtitle}<h5>{subtitle}</h5>{/if}
			</div>
			<button
				on:click={closeModal}
				class='w-14 h-10 bg-gray-300 rounded-bl-[20px] rounded-tr-xl cursor-pointer transition-all text-center text-2xl flex justify-center items-center hover:bg-[#7088DF] hover:text-white'
			>
				<Dismiss />
			</button>
		</div>
		<div class='h-auto mx-4 grow overflow-y-auto overflow-x-visible my-2'>
			<slot />
		</div>
		<div class='mx-4 pb-4 flex justify-end gap-3 shrink-0'>
			<slot name='actions'>
				{#if $$slots.secondaryIcon}
					<Button
						on:click={() => click('secondary')}
						disabled={secondaryDisabled ? true : undefined}
						class='{secondaryClass} bg-[#D8D8D8] border-px border-[#CECECE] bg-[#D8D8D8] text-gray-600 hover:bg-[#EDEDED] [&[disabled]]:opacity-50'
						isIconRight={isSecondaryBtnIconRight}
					>
						<slot slot='icon' name='secondaryIcon' />
						{secondaryText}
					</Button>
				{:else}
					<Button
						on:click={() => click('secondary')}
						disabled={secondaryDisabled ? true : undefined}
						class='{secondaryClass} bg-[#D8D8D8] border-px border-[#CECECE] bg-[#D8D8D8] text-gray-600 hover:bg-[#EDEDED] [&[disabled]]:opacity-50'
						isIconRight={isSecondaryBtnIconRight}
					>
						{secondaryText}
					</Button>
				{/if}
				{#if $$slots.primaryIcon}
					<Button
						on:click={() => click('primary')}
						disabled={primaryDisabled ? true : undefined}
						class='{primaryClass} bg-[#7088DF] text-white [&[disabled]]:opacity-50'
						isIconRight={isPrimaryBtnIconRight}
					>
						<slot slot='icon' name='primaryIcon' />
						{primaryText}
					</Button>
				{:else}
					<Button
						on:click={() => click('primary')}
						disabled={primaryDisabled ? true : undefined}
						class='{primaryClass} bg-[#7088DF] text-white [&[disabled]]:opacity-50'
						isIconRight={isPrimaryBtnIconRight}
					>
						{primaryText}
					</Button>
				{/if}
			</slot>
		</div>
	</div>
</dialog>

<style>
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
