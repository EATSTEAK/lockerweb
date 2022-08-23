<script lang="ts">
    export let reservedSection;
    export let reservedNumber;
    export let tillTime;
</script>

<div class="wrap">
    <h4 class="text-4xl">내 정보</h4>
    <h5 class="text-xl text-blue-500 mt-3">예약한 사물함</h5>
    <div class="reserve-box flex">
        <div class="location-info">
            <div class="text-2xl font-extrabold align-middle">구역</div>
            <div class="location text-7xl font-extrabold">{reservedSection}</div>
        </div>
        <div class="number text-primary-800 text-7xl font-extrabold ml-4">{reservedNumber}</div>
    </div>
    <div class="till ml-3 mt-1">·&nbsp{tillTime}</div>
</div>


<style>
    .reserve-box {
        @apply w-56 h-44 border-2 border-blue-400 rounded-2xl bg-white items-center;
    }

    .location-info {
        @apply flex flex-col w-2/5 h-40 bg-gray-300 rounded-2xl ml-2 text-center justify-center items-center;
    }

    .wrap{
        @apply w-full;
    }
</style>