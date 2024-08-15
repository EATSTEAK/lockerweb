<script lang="ts">
  import NavigationShell from '../../components/molecule/NavigationShell.svelte';
  import Button from '../../components/atom/Button.svelte';
  import UserReservedLocker from '../../components/molecule/reserve/UserReservedLocker.svelte';
  import LockerReserveInfo from '../../components/molecule/reserve/LockerReserveInfo.svelte';
  import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
  import PageTitle from '../../components/atom/PageTitle.svelte';
  import { config, user } from '$lib/store';
  import { getDepartmentConfigs, getServiceConfig } from '$lib/api/config';
  import { browser } from '$app/environment';
  import { deleteAuthorization, getAuthorization } from '$lib/auth';
  import Settings from '../../icons/Settings.svelte';
  import Credit from '../../components/molecule/Credit.svelte';
  import Modal from '../../components/molecule/Modal.svelte';
  import Dismiss from '../../icons/Dismiss.svelte';
  import Skeleton from '../../components/atom/Skeleton.svelte';
  import BookmarkOff from '../../icons/BookmarkOff.svelte';
  import { apiClaimLocker, apiQueryLocker, apiUnclaimLocker } from '$lib/api/locker';
  import SelectedLockerAlert from '../../components/molecule/SelectedLockerAlert.svelte';
  import { extractLockerInfoFromId, getBuildingName } from '$lib/utils';
  import Bookmark from '../../icons/Bookmark.svelte';
  import LockerLoadingScreen from '../../components/atom/LockerLoadingScreen.svelte';
  import ErrorScreen from '../../components/atom/ErrorScreen.svelte';

  function getErrorMessage(errorData: LockerError): string {
    if (errorData.name === 'Blocked') {
      return '현재는 해당 작업을 수행할 수 없습니다. 이용 시간을 확인하세요.';
    } else if (errorData.name === 'Forbidden') {
      return '해당 작업을 수행할 권한이 없습니다. 로그인 여부를 확인하세요.';
    } else if (errorData.name === 'CantClaim') {
      return '이미 다른 사람이 예약한 사물함입니다. 다른 사물함을 예약하세요.';
    } else if (errorData.name === 'CantUnclaim') {
      return '이 사물함은 반납할 수 없습니다. 이미 반납되었을 수 있습니다.';
    } else {
      return '알 수 없는 오류입니다. 관리자에게 문의하세요.';
    }
  }

  let innerWidth: number = 0;
  let contentWidth: number = 0;

  let reservedLocker: ReservedLocker;
  let reservedLockerIds: string[];
  let targetDepartmentId: string;
  let contactModalOpen = false;
  let claimModalOpen: boolean;
  let unclaimModalOpen = false;
  let selectedLockerId: string;
  let errorData: LockerError;

  let isClaiming: boolean;
  let isUnclaiming: boolean;

  $: lockerInfo = selectedLockerId ? extractLockerInfoFromId(selectedLockerId) : undefined;

  $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

  $: departmentConfigs = $config && $config.success ? getDepartmentConfigs($config.result) : [];

  function deleteSessionAndGoIndex() {
    deleteAuthorization();
    window.location.href = '/';
  }

  function getUserReservedLocker(userInfo: User): ReservedLocker {
    if (userInfo?.lockerId) {
      return {
        lockerId: userInfo.lockerId,
        ...(userInfo.claimedUntil && { claimedUntil: userInfo.claimedUntil as Date }),
      };
    }
    return null;
  }

  function queryLockerData() {
    apiQueryLocker()
      .then((res) => {
        if (res.success) {
          reservedLockerIds = res.result.map((reserved) => reserved.lockerId);
        } else {
          if (res.success === false) {
            errorData = res.error;
          } else {
            console.error(res);
            errorData = {
              code: 500,
              name: 'UnknownError',
            };
          }
        }
      })
      .catch((e) => {
        console.error(e);
        errorData = e;
      });
  }

  function claimLocker(lockerId: string) {
    claimModalOpen = false;
    isClaiming = true;
    apiClaimLocker(lockerId)
      .then((res) => {
        isClaiming = false;
        if (res.success) {
          user.refresh();
          queryLockerData();
        } else {
          if (res.success === false) {
            errorData = res.error;
          } else {
            console.error(res);
            errorData = {
              code: 500,
              name: 'UnknownError',
            };
          }
        }
      })
      .catch((e) => {
        isClaiming = false;
        console.error(e);
        errorData = e;
      });
  }

  function unclaimLocker() {
    unclaimModalOpen = false;
    isUnclaiming = true;
    apiUnclaimLocker()
      .then((res) => {
        isUnclaiming = false;
        if (res.success) {
          queryLockerData();
          user.refresh();
        } else {
          if (res.success === false) {
            errorData = res.error;
          } else {
            console.log(res);
            errorData = {
              code: 500,
              name: 'UnknownError',
            };
          }
        }
      })
      .catch((e) => {
        isUnclaiming = false;
        console.error(e);
        errorData = e;
      });
  }

  $: if ($user && $user.success) {
    reservedLocker = getUserReservedLocker($user.result);
    targetDepartmentId = $user.result.department;
  } else {
    reservedLocker = undefined;
  }

  if (browser && !getAuthorization()) {
    deleteSessionAndGoIndex();
  }

  if (browser) {
    queryLockerData();
  }

  // 사용자의 세션이 잘못되었을 경우, 세션 삭제 후 메인 페이지로 이동
  $: if ($user && $user.success === false && browser) {
    const error = $user.error;
    if (error.code === 401 || error.code === 403 || error.code === 404) {
      deleteSessionAndGoIndex();
    }
  }
</script>

<PageTitle name="예약하기" />

<svelte:window bind:innerWidth />

<NavigationShell collapsable={innerWidth && innerWidth <= 1024}>
  <div class="h-full w-full" slot="navigation_content">
    <UserReservedLocker {reservedLocker} on:unclaim={() => (unclaimModalOpen = true)} />
    {#if $config && $config.success}
      <Button
        on:click={() => (contactModalOpen = true)}
        class="px-0 py-0 text-primary-800 underline !shadow-none hover:text-primary-900 hover:!shadow-none active:!shadow-none active:drop-shadow-md">
        도움이 필요하신가요?
      </Button>
    {:else}
      <Skeleton class="mt-2 h-6 w-36 rounded-lg bg-gray-300" />
    {/if}
  </div>
  <div class="flex w-full flex-col gap-2" slot="navigation_footer">
    <div class="flex w-full flex-row items-center justify-between">
      <Button class="bg-primary-800 text-white" href="/logout">
        <ArrowExportLtr slot="icon" class="rotate-180" />
        로그아웃
      </Button>
      {#if $user && $user.success && $user.result.isAdmin}
        <Button class="bg-red-200 text-gray-800" isIconRight href="/admin">
          서비스 관리
          <Settings slot="icon" />
        </Button>
      {:else}
        <Credit />
      {/if}
    </div>
  </div>
  <div class="relative h-full" bind:clientWidth={contentWidth}>
    {#if !errorData}
      {#if selectedLockerId && !isClaiming && !isUnclaiming}
        <SelectedLockerAlert
          {selectedLockerId}
          width={contentWidth}
          on:click:secondary={() => (selectedLockerId = undefined)}
          on:click={() => (claimModalOpen = true)} />
      {/if}
      {#if !isClaiming && !isUnclaiming}
        <LockerReserveInfo
          bind:selectedLockerId
          {targetDepartmentId}
          {serviceConfig}
          {reservedLockerIds} />
      {:else if isClaiming}
        <LockerLoadingScreen
          class="h-full w-full"
          message="예약 중.."
          selectedLockerInfo={`${lockerInfo.floor}층 | ${lockerInfo.sectionId}구역 - ${lockerInfo.lockerNum}번`} />
      {:else if isUnclaiming}
        <LockerLoadingScreen class="h-full w-full" message="반납 중.." />
      {/if}
    {:else}
      <ErrorScreen
        class="h-full w-full"
        errorTitle={`${errorData.code}`}
        errorMessage={getErrorMessage(errorData)} />
    {/if}
  </div>
</NavigationShell>

<Modal
  title="학과(부) 연락처"
  bind:open={contactModalOpen}
  secondaryClass="hidden"
  primaryText="닫기"
  on:close={() => (contactModalOpen = false)}
  on:click={() => (contactModalOpen = false)}>
  {#each departmentConfigs as departmentConfig}
    {#if departmentConfig.contact}
      <div class="my-2 leading-10">
        <h5>{departmentConfig.name} 연락처</h5>
        <p class="text-gray-700">{departmentConfig.contact}</p>
      </div>
    {/if}
  {:else}
    입력된 연락처가 없습니다.
  {/each}
  <Dismiss slot="primaryIcon" />
</Modal>

<Modal
  title="예약 확인"
  bind:open={claimModalOpen}
  primaryText="예약하기"
  on:click={() => claimLocker(selectedLockerId)}
  on:click:secondary={() => (claimModalOpen = false)}
  on:close={() => (claimModalOpen = false)}>
  정말로 {getBuildingName(serviceConfig?.buildings, lockerInfo?.buildingId)}
  {lockerInfo?.floor}
  층 {lockerInfo?.sectionId}
  구역 {lockerInfo?.lockerNum}번 사물함을 대여하시겠습니까?
  <Bookmark slot="primaryIcon" />
</Modal>

<Modal
  title="예약 취소 확인"
  bind:open={unclaimModalOpen}
  primaryText="예약 취소"
  on:click={() => unclaimLocker()}
  on:click:secondary={() => (unclaimModalOpen = false)}
  on:close={() => (unclaimModalOpen = false)}>
  정말로 예약하신 사물함을 예약 취소하시겠습니까?
  <BookmarkOff slot="primaryIcon" />
</Modal>
