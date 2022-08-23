<script lang="ts">
import SelectionListItemGroup from "../../atom/SelectionListItemGroup.svelte";
import SelectionListItem from "../../atom/SelectionListItem.svelte";
import LockerItem from "./LockerItem.svelte";
import Modal from "../Modal.svelte";
// import {lockerCount} from "../login/LockerStatus.svelte";

let LockerGirdHeight: number | undefined = 4;
let LockerRangeCount: number | undefined = 20;
let LockerGirdWidthScale: number | undefined = 14.5*(LockerRangeCount/LockerGirdHeight);
</script>

<div class="wrap">
    <div class="select-info">
        <div class="select-location">
            <h4 class="text-3xl my-2 ml-4">구역 선택</h4>
            <div class="location-depths">
                <div class="select-floor">
                    <SelectionListItemGroup class="location-select-group">
                        <SelectionListItem class="location-select-item"></SelectionListItem>
                    </SelectionListItemGroup>
                </div>
                <div class="select-area">
                    <SelectionListItemGroup>
                        <SelectionListItem class="location-select-item"></SelectionListItem>
                    </SelectionListItemGroup>
                </div>
            </div>
        </div>
        <div class="locker-map">
            <img class="map-img" src="/floorMaps/1F.svg" alt="정보과학관 1층 이미지" aria-level="정보과학관 1층 이미지">
        </div>
    </div>
        <div class="locker-grid" style={`width:${LockerGirdWidthScale}rem;`}>
            <LockerItem />
        </div>
</div>

<style>
    .wrap{
        @apply w-full h-screen;
    }

    /* -------------- 영역 선택 및 지도 -------------- */
    .select-info {
        @apply flex flex-row h-[370px] min-h-[370px];
    }
    .select-location {
        @apply bg-[#d8dee5] w-2/5 md:min-w-[480px];
    }
    .locker-map {
        @apply bg-slate-200 w-3/5;
    }


    .location-depths {
        @apply w-full h-5/6 flex;
    }
    .select-floor{
        @apply pl-8 pr-1 w-1/2;
    }
    .select-area {
        @apply pr-8 pl-1 w-1/2;
    }

    .location-select-group{
        @apply h-full;
    }
    :global(.location-select-item) {
        @apply h-11;
    }


    .locker-map {
        @apply flex;
    }
    .map-img {
        @apply flex ml-auto mr-auto mt-10 h-4/5;
    }
    /* -------------- 사물함 그리드 영역 -------------- */
    .locker-grid {
        @apply h-3/5 flex flex-row flex-wrap overflow-y-scroll mt-14 pt-3 ml-auto mr-auto;
    }
    .locker-grid{
        scrollbar-color: #c2c2c2 #e0e0e0;
        scrollbar-width: thin;
    }
    /*.locker-grid::-webkit-scrollbar {*/
    /*    width: 16px;*/
    /*}*/

    /*.locker-grid::-webkit-scrollbar-track {*/
    /*    background-color: #e4e4e4;*/
    /*    border-radius: 100px;*/
    /*}*/
    /*.locker-grid::-webkit-scrollbar-thumb {*/
    /*    background-color: #d4aa70;*/
    /*    border-radius: 100px;*/
    /*}*/
    /*.locker-grid::-webkit-scrollbar{*/
    /*    display:none;*/
    /*}*/
    /*.locker-grid {*/
    /*    -ms-overflow-style: none;  !* IE and 엣지 *!*/
    /*    scrollbar-width: none;  !* 파이어폭스 *!*/
    /*}*/
</style>