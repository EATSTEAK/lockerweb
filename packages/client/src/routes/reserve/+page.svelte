<script lang="ts">
    import ChevronDown from '../../icons/ChevronDown.svelte';
    import type { LockerCount} from "$lib/types";
    import SelectionListItemGroup from "../../components/atom/SelectionListItemGroup.svelte";
    import SelectionListItem from "../../components/atom/SelectionListItem.svelte";
    import Profile from "../../components/molecule/Profile.svelte";
    import {user} from "$lib/store.js";
    import Soongsil from "../../icons/Soongsil.svelte";
    import Button from "../../components/atom/Button.svelte";
    import UserReservedLocker from "../../components/molecule/reserve/UserReservedLocker.svelte";
    import Logout from "../../icons/Logout.svelte";
    import LockerRserveInfo from "../../components/molecule/reserve/LockerReserveInfo.svelte";
    import Modal from "../../components/molecule/Modal.svelte";

    let callbackUrl = undefined;
    let countData: LockerCountResponse;
    let lockerCount: LockerCount;

</script>
<div class='root'>
    <div class='side-wrap'>
        <div class="profile-wrap">
            <div class='logo'>
                <Soongsil class='w-20 h-20' />
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
            <div class="contact-text">
                <p>글로벌미디어학부</p>
                <p>010-1234-1234</p>
            </div>
        </div>
    </div>
    <div class='locker-reserve-info-wrap'>
        <LockerRserveInfo />
    </div>
</div>

<style>
    .root {
        @apply flex flex-col md:flex-row h-screen overflow-hidden;
    }
    .logo {
        @apply top-2;
    }
    .side-wrap {
        @apply bg-gray-200 md:min-w-[380px] md:w-[380px] flex flex-col justify-between min-h-screen px-10 pb-5 pt-10;
    }
    .locker-reserve-info-wrap {
        @apply w-full;
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
</style>