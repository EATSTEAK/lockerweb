<script lang="ts">
  import Button from '../../components/atom/Button.svelte';
  import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
  import MailInbox from '../../icons/MailInbox.svelte';
  import SelectionListItemGroup from '../../components/atom/SelectionListItemGroup.svelte';
  import SelectionListItem from '../../components/atom/SelectionListItem.svelte';
  import UserSettings from '../../components/molecule/admin/user/UserSettings.svelte';
  import ServiceSettings from '../../components/molecule/admin/service/ServiceSettings.svelte';
  import { user } from '$lib/store';
  import DepartmentSettings from '../../components/molecule/admin/department/DepartmentSettings.svelte';
  import PeopleSettings from '../../icons/PeopleSettings.svelte';
  import Settings from '../../icons/Settings.svelte';
  import ContentSettings from '../../icons/ContentSettings.svelte';
  import { browser } from '$app/environment';
  import { deleteAuthorization, getAuthorization } from '$lib/auth';
  import { apiBatchDeleteUser, apiBatchPutUser, apiQueryUser, apiUpdateUser } from '$lib/api/user';
  import LoadingScreen from '../../components/atom/LoadingScreen.svelte';
  import ErrorScreen from '../../components/atom/ErrorScreen.svelte';
  import Skeleton from '../../components/atom/Skeleton.svelte';
  import NavigationShell from '../../components/molecule/NavigationShell.svelte';
  import PageTitle from '../../components/atom/PageTitle.svelte';

  const ids = ['user', 'service', 'department'];
  let selectedTabIndex = 0;
  $: selectedTab = ids[selectedTabIndex];

  let userUpdating = false;
  let userRequestError = null;

  let userPromise: Promise<Array<User>>;

  if (browser) {
    queryUser();
  }

  if (browser && !getAuthorization()) {
    deleteSessionAndGoIndex();
  }

  // 사용자의 세션이 잘못되었을 경우, 세션 삭제 후 메인 페이지로 이동
  $: if ($user && $user.success === false && browser) {
    const error = $user.error;
    if (error.code === 401 || error.code === 403 || error.code === 404) {
      deleteSessionAndGoIndex();
    }
  }

  let navigationCollapsed = true;
  let innerWidth = 0;

  function deleteSessionAndGoIndex() {
    deleteAuthorization();
    window.location.href = '/';
  }

  function closeSidebarMenu() {
    navigationCollapsed = true;
  }

  function queryUser() {
    userPromise = apiQueryUser().then((res) => {
      if (res.success) {
        return res.result;
      }
      throw (res as ErrorResponse<LockerError>).error;
    });
  }

  function updateUser(evt: CustomEvent<UserUpdateRequest>) {
    userUpdating = true;
    apiUpdateUser(evt.detail)
      .then((res) => {
        userUpdating = false;
        if (res.success) {
          queryUser();
        } else {
          userRequestError = (res as ErrorResponse<LockerError>).error.name;
          console.error((res as ErrorResponse<LockerError>).error);
        }
      })
      .catch((err) => {
        userUpdating = false;
        userRequestError = err;
      });
  }

  function batchPutUser(evt: CustomEvent<User[]>) {
    userUpdating = true;
    apiBatchPutUser(evt.detail)
      .then((res) => {
        userUpdating = false;
        if (res.success) {
          queryUser();
        } else {
          userRequestError = (res as ErrorResponse<LockerError>).error.name;
          console.error((res as ErrorResponse<LockerError>).error);
        }
      })
      .catch((err) => {
        userUpdating = false;
        userRequestError = err;
      });
  }

  function batchDeleteUser(evt: CustomEvent<string[]>) {
    userUpdating = true;
    apiBatchDeleteUser(evt.detail)
      .then((res) => {
        userUpdating = false;
        if (res.success) {
          queryUser();
        } else {
          userRequestError = (res as ErrorResponse<LockerError>).error.name;
          console.error((res as ErrorResponse<LockerError>).error);
        }
      })
      .catch((err) => {
        userUpdating = false;
        userRequestError = err;
      });
  }
</script>

<PageTitle name="서비스 관리" />

<svelte:window bind:innerWidth />

<NavigationShell
  bind:navigationCollapsed
  collapsable={innerWidth && innerWidth <= 1024}
  disableBlock>
  <section class="flex flex-col gap-1" slot="navigation_content">
    {#if $user && $user.success}
      <h3>설정</h3>
      <SelectionListItemGroup bind:selectedIndex={selectedTabIndex}>
        <SelectionListItem
          on:click={closeSidebarMenu}
          class="flex items-center justify-between"
          id="user">
          <span>사용자 설정</span>
          <PeopleSettings />
        </SelectionListItem>
        <SelectionListItem
          on:click={closeSidebarMenu}
          class="flex items-center justify-between"
          id="service">
          <span>서비스 설정</span>
          <Settings />
        </SelectionListItem>
        <SelectionListItem
          on:click={closeSidebarMenu}
          class="flex items-center justify-between"
          id="department">
          <span>학과(부)별 설정</span>
          <ContentSettings />
        </SelectionListItem>
      </SelectionListItemGroup>
    {:else if $user === undefined}
      <Skeleton class="h-12 w-32 rounded-lg bg-gray-300" />
      <Skeleton class="h-36 w-full rounded-xl bg-gray-300" />
    {/if}
  </section>
  <section class="flex w-full items-center justify-between" slot="navigation_footer">
    <Button class="bg-primary-800 text-white" href="/logout">
      <ArrowExportLtr slot="icon" class="rotate-180" />
      로그아웃
    </Button>
    <Button class="bg-green-200 text-black" isIconRight={true} href="/reserve">
      <MailInbox slot="icon" />
      예약 페이지로
    </Button>
  </section>
  <div class="h-screen">
    {#if $user && $user.success && (!$user.result.department || $user.result.isAdmin)}
      {#if selectedTab === 'user'}
        {#await userPromise}
          <div class="my-8 lg:mx-8 flex flex-col gap-3 w-auto items-stretch">
            <div class="mx-6 lg:mx-0 flex flex-wrap w-full">
              <h3>사용자 설정</h3>
            </div>
            <LoadingScreen class="min-h-[32rem] lg:rounded-md" />
          </div>
        {:then users}
          <UserSettings
            on:user:update={updateUser}
            on:user:batchPut={batchPutUser}
            on:user:batchDelete={batchDeleteUser}
            updating={userUpdating}
            error={userRequestError}
            {users} />
        {:catch err}
          <div class="my-8 lg:mx-8 flex flex-col gap-3 w-auto items-stretch">
            <div class="mx-6 lg:mx-0 flex flex-wrap w-full">
              <h3 class="mb-1">사용자 설정</h3>
            </div>
            <ErrorScreen class="min-h-[32rem] lg:rounded-md" />
          </div>
        {/await}
      {:else if selectedTab === 'service'}
        <ServiceSettings />
      {:else if selectedTab === 'department'}
        <DepartmentSettings />
      {/if}
    {:else if $user === undefined}
      <LoadingScreen class="min-h-[480px]" />
    {:else}
      <ErrorScreen class="min-h-[480px]" errorMessage="권한이 부족하여 접근하실 수 없습니다." />
    {/if}
  </div>
</NavigationShell>
