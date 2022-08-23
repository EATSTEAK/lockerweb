<script lang="ts">
    import Button from "../atom/Button.svelte";
    import Dismiss from "../../icons/brands/Dismiss.svelte";
</script>

<dialog open class="modal-frame">
        <div class="title-section">
            <div class="text">
                <h3 class="modal-title">MODAL</h3>
                <h3 class="modal-subtitle">SUBTITLE</h3>
            </div>
            <div class="close-btn">
                <span class="dismiss-icon-wrap"><Dismiss /></span>
            </div>
        </div>
        <div class="content-section">
            <slot />
        </div>
        <div class="button-section">
            <Button isIconRight="{false}" class="confirm-btn bg-[#7088DF] text-2xl text-white">
                확인
            </Button>
            <Button isIconRight="{false}" class="cancel-btn bg-[#D8D8D8] text-2xl text-gray-600 px-3">
                취소
            </Button>
        </div>
</dialog>
<div class="background"></div>

<style>
    .modal-frame {
        @apply
        grow

        p-2

        bg-gray-200

        -translate-y-1/2
        top-1/2

        rounded-[19px] fixed z-30
        flex-col
        overflow-hidden

        transition-all;
    }
    .modal-frame:hover{
        @apply drop-shadow-xl;
    }

    .title-section {
        @apply w-full h-[16%] px-2 relative select-none;
    }
    .modal-title {
        @apply text-[3rem] text-gray-700 pt-1;
    }
    .modal-subtitle{
        @apply text-3xl text-gray-700;
    }
    .close-btn {
        @apply w-[70px] h-[50px] bg-gray-300 absolute -top-5 -right-5 rounded-bl-[20px] cursor-pointer transition-all font-extrabold text-center text-2xl pl-[20px] pt-4;
    }
    .close-btn:hover{
        @apply bg-[#7088DF] text-white drop-shadow-2xl translate-x-[2px];
    }
    .close-btn:hover .dismiss-icon-wrap{
        filter: none;
    }
    .dismiss-icon-wrap {
        filter: invert(59%) sepia(91%) saturate(0%) hue-rotate(134deg) brightness(82%) contrast(83%);
    }


    .content-section {
        @apply w-full h-4/6 mb-4;
    }
    .button-section {
        @apply flex justify-end gap-3 pr-3;
    }

    :global(.confirm-btn) {
        @apply h-[53px] pt-[10px]
    }
    :global(.cancel-btn) {
        @apply h-[53px] pt-[10px] px-6 bg-[#D8D8D8] border-[1px] border-[#CECECE] cursor-pointer text-2xl font-bold;
    }
    :global(.cancel-btn:hover){
        @apply bg-[#EDEDED];
    }
    .background {
        @apply w-screen h-screen z-10 fixed bg-black opacity-50;
    }
</style>