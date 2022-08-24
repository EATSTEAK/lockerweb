<script lang='ts'>
	import Button from '../atom/Button.svelte';
	import Dismiss from '../../icons/Dismiss.svelte';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let title: string;
	export let subtitle: string = '';
	export let noBackdrop: boolean = false;

	export let primaryText: string = '확인';
	export let secondaryText: string = '취소';
	export let isPrimaryBtnIconRight = false;
	export let isSecondaryBtnIconRight = false;

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
		if (event.view === win) return;
		const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
			&& rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		console.log(isInDialog);
		if (!isInDialog) {
			closeModal();
		}
	}
</script>

<dialog on:click={outClick} bind:this={dialog} {open} class={`modal-frame ${clazz}`} {...$$restProps}>
	<div class='wrap'>
		<div class='section-title'>
			<div class='text'>
				<h4>{title}</h4>
				{#if subtitle}<h5>{subtitle}</h5>{/if}
			</div>
			<button on:click={closeModal} class='close-btn'>
				<Dismiss />
			</button>
		</div>
		<div class='section-contents'>
			<slot />
		</div>
		<div class='section-actions'>
			<slot name='actions'>
				<Button on:click={() => click('secondary')} class='secondary-btn bg-[#D8D8D8] text-gray-600'
								isIconRight={isSecondaryBtnIconRight}>
					<slot slot='icon' name='secondaryIcon' />
					{secondaryText}
				</Button>
				<Button on:click={() => click('primary')} class='primary-btn bg-[#7088DF] text-white'
								isIconRight={isPrimaryBtnIconRight}>
					<slot slot='icon' name='primaryIcon' />
					{primaryText}
				</Button>
			</slot>
		</div>
	</div>
</dialog>

<style>
    .modal-frame {
        @apply grow bg-gray-200
        rounded-xl
        fixed
        p-4
        z-50
        overflow-hidden
        transition-all
        shadow-xl
        md:w-[480px];
    }

    .wrap {
        @apply flex flex-col items-stretch gap-3 w-full h-full;
    }

    .section-title {
        @apply -mx-4 -mt-4 flex justify-between select-none;
    }

    .text {
        @apply pl-4 pt-3 text-gray-700;
    }

    .close-btn {
        @apply w-14 h-10 bg-gray-300 rounded-bl-[20px] cursor-pointer transition-all text-center text-2xl flex justify-center items-center;
    }

    .close-btn:hover {
        @apply bg-[#7088DF] text-white;
    }


    .section-contents {
        @apply grow;
    }

    .section-actions {
        @apply flex justify-end gap-3;
    }

    .section-actions :global(.secondary-btn) {
        @apply bg-[#D8D8D8] border-[1px] border-[#CECECE];
    }

    .section-actions :global(.secondary-btn:hover) {
        @apply bg-[#EDEDED];
    }

    dialog::backdrop {
        @apply bg-black opacity-30;
    }

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