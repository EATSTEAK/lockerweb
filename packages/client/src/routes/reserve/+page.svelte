<script lang="ts">
    import ChevronDown from '../../icons/ChevronDown.svelte';
    import type {LockerCount} from "$lib/types";
    import SelectionListItemGroup from "../../components/atom/SelectionListItemGroup.svelte";
    import SelectionListItem from "../../components/atom/SelectionListItem.svelte";
    import Profile from "../../components/molecule/Profile.svelte";
    import {user} from "$lib/store.js";
    import Soongsil from "../../icons/Soongsil.svelte";
    import Button from "../../components/atom/Button.svelte";
    import UserReservedLocker from "../../components/molecule/reserve/UserReservedLocker.svelte";
    import LockerRserveInfo from "../../components/molecule/reserve/LockerReserveInfo.svelte";
    import Skeleton from "../../components/atom/Skeleton.svelte";

    let callbackUrl = undefined;
    let countData: LockerCountResponse;
    let lockerCount: LockerCount;

    let fetchContactStatus: boolean = false;
</script>
<div class='root'>
    <div class='side-wrap'>
        <div class="profile-wrap">
            <div class='logo'>
                <Soongsil class='w-20 h-20'/>
            </div>
            <Profile class="profile" user={$user}/>
            <div class="divide-line"></div>
        </div>

        <div class="user-info">
            <UserReservedLocker reservedSection="A" reservedNumber="15" tillTime="00:00 ~ 14:00"/>
        </div>
        <div class="flex justify-between w-full">
            <Button isIconRight="{false}" class="bg-primary-800 text-white text-center flex justify-between">
                로그아웃
            </Button>
            {#if fetchContactStatus}
                <div class="contact-text">
                    <p>글로벌미디어학부</p>
                    <p>010-1234-1234</p>
                </div>
            {:else}
                <div class="flex flex-col">
                    <Skeleton class="contact-text-skeleton"></Skeleton>
                    <Skeleton class="contact-number-skeleton"></Skeleton>
                </div>
            {/if}
        </div>
    </div>
    <div class='locker-reserve-info-wrap'>
        <LockerRserveInfo/>
    </div>
</div>

<style>
    .root {
        @apply flex flex-col md:flex-row w-screen h-screen overflow-hidden;
    }

    .logo {
        @apply top-2;
    }

    .side-wrap {
        @apply bg-gray-200 w-[380px] md:min-w-[380px] md:w-[380px] flex flex-col justify-between min-h-screen px-10 pb-5 pt-10;
    }

    .locker-reserve-info-wrap {
        @apply grow overflow-scroll;
    }

    .profile-wrap {
        @apply flex flex-col gap-10;
    }

    .divide-line {
        @apply w-full h-0.5 bg-gray-300 mt-6;
    }

    .user-info {
        @apply w-full h-96;
    }

    :global(.contact-text-skeleton) {
        @apply w-20 h-4 rounded-sm bg-gray-300;
    }

    :global(.contact-number-skeleton) {
        @apply w-16 h-4 mt-1 rounded-sm bg-gray-300;
    }
</style>