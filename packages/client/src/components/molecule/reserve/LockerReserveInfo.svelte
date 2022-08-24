<script lang="ts">
  import SelectionListItemGroup from "../../atom/SelectionListItemGroup.svelte";
  import SelectionListItem from "../../atom/SelectionListItem.svelte";
  import LockerItem from "./LockerItem.svelte";
  import Modal from "../Modal.svelte";
  // import {lockerCount} from "../login/LockerStatus.svelte";

  let lockerGridHeight: number | undefined = 5;
  let lockerRangeCount: number | undefined = 40;
  let lockerGridWidthScale: number | undefined = 5.05 * (lockerRangeCount / lockerGridHeight);
  console.log(lockerGridWidthScale);
  let lockerGridHeightScale: number | undefined = 5 * lockerGridHeight;
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
  <div class="locker-grid-wrap">
    <div class="locker-grid" style={`width:${lockerGridWidthScale}rem; height:${lockerGridHeightScale}rem;`}>
      {#each { length: lockerRangeCount } as _, i}
        <LockerItem lockerLocation="A" lockerNumber={i+1}/>
      {/each}
    </div>
  </div>
</div>

<style>
    .wrap {
        /* width: auto; 가 아닌 width: 100%; 라면 overflow 된 자식 요소의 크기를 따라간다?? */
        @apply w-auto;
    }

    /* -------------- 영역 선택 및 지도 -------------- */
    .select-info {
        @apply flex flex-row min-h-[370px];
    }

    .select-location {
        @apply bg-[#d8dee5] w-fit md:min-w-[470px];
    }

    .locker-map {
        @apply bg-slate-200 grow;
    }


    .location-depths {
        @apply w-full h-5/6 flex;
    }

    .select-floor {
        @apply pl-8 pr-1 w-1/2;
    }

    .select-area {
        @apply pr-8 pl-1 w-1/2;
    }

    .location-select-group {
        @apply h-full;
    }

    :global(.location-select-item) {
        @apply h-11;
    }

    .locker-map {
        @apply flex;
    }

    .map-img {
        @apply flex max-h-[270px] ml-auto mr-auto mt-10;
    }

    /* -------------- 사물함 그리드 영역 -------------- */
    .locker-grid-wrap {
        @apply overflow-scroll;
    }

    .locker-grid {
        @apply flex flex-row flex-wrap mt-5 ml-auto mr-auto;
        crollbar-color: #c2c2c2 #e0e0e0;
        scrollbar-width: thin;
    }
</style>