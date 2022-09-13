<script lang="ts">
  import Navigation from './Navigation.svelte';
  import NavigationHeader from '../atom/NavigationHeader.svelte';
  import Soongsil from '../../icons/Soongsil.svelte';
  import NavigationContent from '../atom/NavigationContent.svelte';
  import NavigationFooter from '../atom/NavigationFooter.svelte';
  import Divider from '../../components/atom/Divider.svelte';
  import Button from '../atom/Button.svelte';
  import ArrowExportLtr from '../../icons/ArrowExportLtr.svelte';
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { goto } from '$app/navigation';
  import { config, user } from '$lib/store';
  import { getDepartmentConfig, getServiceConfig } from '$lib/api/config';
  import { isActivated } from '$lib/utils';
  import Info from '../../icons/Info.svelte';
  import { extractLockerInfoFromId } from '$lib/utils.js';

  let clazz = '';
  export { clazz as class };

  let currentTime = new Date();

  $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

  onMount(() => {
    if (!disableBlock) {
      const interval = setInterval(() => {
        currentTime = new Date();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  });

  $: if (
    $config &&
    $config.success &&
    $user &&
    $user.success &&
    !disableBlock &&
    !isReservable($config.result, $user.result, currentTime)
  ) {
    blockedModalOpen = true;
  }

  let blockedModalOpen = false;

  function isReservable(config: Config[], user: User, time: Date): boolean {
    if (!user || user.isAdmin) return true;
    const userDeptConfig: DepartmentConfig = getDepartmentConfig(
      config,
      user.department,
    ) as DepartmentConfig;
    if (serviceConfig && userDeptConfig) {
      return (
        isActivated(serviceConfig.activateFrom as Date, serviceConfig.activateTo as Date) &&
        isActivated(userDeptConfig.activateFrom as Date, userDeptConfig.activateTo as Date)
      );
    }
    if (serviceConfig) {
      return isActivated(serviceConfig.activateFrom as Date, serviceConfig.activateTo as Date);
    }
    if (userDeptConfig) {
      return isActivated(userDeptConfig.activateFrom as Date, userDeptConfig.activateTo as Date);
    }
    return true;
  }

  export let navigationClass = '';
  export let mainClass = '';

  export let disableBlock = false;
</script>

<main class="{clazz} flex flex-col items-stretch lg:flex-row">
  <section class="{navigationClass} row flex w-full lg:h-screen lg:min-w-[380px] lg:basis-[380px]">
    <slot name="navigation">
      <Navigation class="h-full w-full flex-row">
        <NavigationHeader class="py-1 lg:py-0 lg:pt-10" slot="header">
          <Soongsil class="h-12 w-12 lg:h-20 lg:w-20" />
        </NavigationHeader>
        <Divider class="my-6" />
        <NavigationContent />
        <NavigationFooter>
          <Button class="bg-primary-800 text-white" isIconRight={true} href="/logout">
            <ArrowExportLtr slot="icon" />
            로그아웃
          </Button>
          <Button on:click={() => (blockedModalOpen = true)}>예약불가</Button>
        </NavigationFooter>
      </Navigation>
    </slot>
  </section>
  <section class="{mainClass} grow overflow-x-auto lg:max-h-screen lg:overflow-y-auto">
    {#if serviceConfig && serviceConfig.alert}
      <div class="my-4 mx-6 flex gap-3 rounded-md bg-primary-200 p-6 lg:mx-8">
        <Info />
        <div class="grow">
          <span class="font-bold">안내:</span>
          {serviceConfig.alert}
        </div>
      </div>
    {/if}
    <slot />
  </section>
</main>

<!--suppress JSUnresolvedVariable -->
<Modal
  title="예약 불가 알림"
  bind:open={blockedModalOpen}
  preventOutclick
  on:cancel={() => {}}
  secondaryClass="hidden"
  primaryText="로그아웃"
  isPrimaryBtnIconRight
  on:click={() => goto('/logout')}
>
  <p>현재 예약 가능한 시간이 아닙니다.</p>
  {#if $user && $user.success && $user.result.lockerId}
    {@const lockerInfo = extractLockerInfoFromId($user.result.lockerId)}
    <p>
      내가 예약한 사물함: <span class="rounded-lg bg-gray-300 py-1 px-2"
        >{lockerInfo.floor}층 | {lockerInfo.sectionId}구역 - {lockerInfo.lockerNum}번</span
      >
    </p>
  {/if}
  <ArrowExportLtr slot="primaryIcon" />
</Modal>
