<script lang="ts">
  export let lockerLocation: string;
  export let lockerNumber: number;
</script>

<div class="locker-item">
  <div class="location-title">
      <p>{lockerLocation}</p><p>구역</p>
  </div>
  <div class="divide-line"></div>
  <div class="locker-number">{lockerNumber}</div>
</div>

<style>
    .locker-item {
        @apply flex flex-col w-16 h-16 flex ml-4 mb-2 border-2 rounded-xl cursor-pointer transition-all;
    }

    .locker-item:hover {
        @apply scale-105;
    }

    .locker-item:active {
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

    .disabled:hover {
        @apply scale-100;
    }


    .location-title {
        @apply flex mr-auto ml-auto font-normal text-xs text-gray-400 mt-1 mx-1 text-center mb-auto select-none;
    }

    .divide-line {
        @apply w-10 h-px bg-gray-200 ml-auto mr-auto mt-auto mb-auto;
    }

    .locker-number {
        @apply text-2xl font-extrabold text-gray-500 text-center mr-auto ml-auto pb-0.5 select-none;
    }
</style>