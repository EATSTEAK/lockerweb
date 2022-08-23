<script lang="ts">

</script>

<div class="locker-item">
    <div class="location-title">
        ·&nbsp&nbsp&nbsp A구역&nbsp&nbsp&nbsp·
    </div>
    <div class="divide-line"></div>
    <div class="locker-number">01</div>
</div>

<style>
    .locker-item {
        @apply w-40 h-40 border-4 ml-14 mb-14 border-gray-300 rounded-3xl cursor-pointer transition-all;
    }
    .locker-item:hover{
        @apply scale-105;
    }
    .locker-item:active{
        @apply scale-100;
    }

    .selected {
        @apply border-8 border-blue-400;
    }
    .selected > div {
        @apply text-blue-400;
    }
    .selected > .divide-line {
        @apply bg-blue-300;
    }

    .disabled {
        @apply opacity-60 transition-all;
    }
    .disabled:hover{
        @apply scale-100;
    }


    .location-title{
        @apply font-extrabold text-gray-400 text-2xl text-center my-3 select-none;
    }
    .divide-line {
        @apply w-4/5 h-[3px] bg-gray-300 ml-auto mr-auto;
    }
    .locker-number {
        @apply text-7xl font-extrabold text-gray-500 text-center mt-2.5 select-none;
    }
</style>