<script lang="ts">
    import Entry from '../components/molecule/login/Entry.svelte';
    import Button from '../components/atom/Button.svelte';
    import Soongsil from '../icons/Soongsil.svelte';
    import LockerStatus from '../components/molecule/login/LockerStatus.svelte';
    import {browser} from '$app/environment';
    import {getAuthorization} from '$lib/auth';
    import {config} from '$lib/store';
    import type {DepartmentLockerCount, LockerCount} from '$lib/types';
    import {getDepartmentLockerCountsByFloor} from '$lib/utils';
    import Shell from '../components/molecule/Shell.svelte';
    import Navigation from '../components/molecule/Navigation.svelte';
    import NavigationContent from '../components/atom/NavigationContent.svelte';
    import NavigationFooter from '../components/atom/NavigationFooter.svelte';
    import Credit from '../components/molecule/Credit.svelte';
    import ChevronDown from '../icons/ChevronDown.svelte';
    import Modal from '../components/molecule/Modal.svelte';
    import Dismiss from '../icons/Dismiss.svelte';
    import {apiCountLocker} from '$lib/api/locker';
    import {getDepartmentConfigs, getServiceConfig} from '$lib/api/config';
    import {goto} from '$app/navigation';
    import ErrorScreen from '../components/atom/ErrorScreen.svelte';
    import {fade} from 'svelte/transition';
    import {isActivated} from '$lib/utils.js';
    import ErrorCircle from '../icons/ErrorCircle.svelte';
    import PageTitle from "../components/atom/PageTitle.svelte";

    function updateLockerCount(configs: Config[], countInfo: LockerCountResponse): LockerCount {
        const departmentConfigs = getDepartmentConfigs(configs);
        const sConfig = getServiceConfig(configs);

        function transformLockerCount(
            serviceConfig: ServiceConfig,
            departmentConfig: DepartmentConfig,
            departmentCount?: { [buildingNum: string]: { [floor: string]: number } },
        ): DepartmentLockerCount {
            const buildingLockers = getDepartmentLockerCountsByFloor(serviceConfig, departmentConfig.id);
            const totalLocker = Object.values(buildingLockers)
                .flatMap((floor) => Object.values(floor))
                .reduce<number>((a: number, v: number) => a + v, 0);
            const totalReserved = departmentCount
                ? Object.values(departmentCount)
                    .flatMap((floor) => Object.values(floor))
                    .reduce<number>((a: number, v: number) => a + v, 0)
                : 0;
            const lockers = Object.fromEntries(
                Object.entries(buildingLockers).map(([buildingNum, floors]) => [
                    buildingNum,
                    Object.fromEntries(
                        Object.entries(floors).map(([floor, count]) => [
                            floor,
                            {
                                totalLocker: count,
                                lockerLeft: count - (departmentCount?.[buildingNum]?.[floor] ?? 0),
                            },
                        ]),
                    ),
                ]),
            );
            return {
                departmentName: departmentConfig.name,
                lockerLeft: totalLocker - totalReserved,
                totalLocker,
                ...(departmentConfig.activateFrom && {
                    activateFrom: departmentConfig.activateFrom as Date,
                }),
                ...(departmentConfig.activateTo && {activateTo: departmentConfig.activateTo as Date}),
                contact: departmentConfig.contact ?? '',
                lockers,
            };
        }

        return Object.fromEntries(
            departmentConfigs.map<[string, DepartmentLockerCount]>((conf) => [
                conf.id,
                transformLockerCount(sConfig, conf, countInfo?.[conf.id]),
            ]),
        );
    }

    let callbackUrl = undefined;

    let apiResponse: SuccessResponse<LockerCountResponse> | ErrorResponse<LockerError>;

    let lockerCount: LockerCount = null;

    let contactModalOpen = false;

    if (browser) {
        if (getAuthorization()) {
            goto('/reserve');
        }
        callbackUrl = window.location.protocol + '//' + window.location.host + '/callback/';
        apiCountLocker()
            .then((data) => {
                apiResponse = data;
            })
            .catch((error) => console.error(error));
    }

    $: countData = apiResponse && apiResponse.success ? apiResponse.result : undefined;

    $: errorData = apiResponse && apiResponse.success === false ? apiResponse.error : undefined;

    $: serviceConfig = $config && $config.success ? getServiceConfig($config.result) : undefined;

    $: departmentConfigs = $config && $config.success ? getDepartmentConfigs($config.result) : [];

    $: if ($config && $config.success && countData) {
        lockerCount = updateLockerCount($config.result, countData);
    }
</script>

<PageTitle/>

<Shell>
    <Navigation slot="navigation" class="h-full min-h-screen w-full" collapsable={false}>
        <NavigationContent>
            <Entry class="h-full grow justify-center" name="SOONGSIL UNIV. IT">
                {#if serviceConfig && !isActivated(serviceConfig.activateFrom, serviceConfig.activateTo)}
                    <Button
                            disabled={callbackUrl ? undefined : true}
                            href="https://lms.ssu.ac.kr/xn-sso/gw.php?login_type=sso&callback_url={encodeURIComponent(
              callbackUrl,
            )}"
                            rel="external"
                            class="h-16 w-full bg-red-800 text-xl text-white"
                            isIconRight>
                        예약 불가(열람만 가능)
                        <ErrorCircle class="h-8 w-8" slot="icon"/>
                    </Button>
                {:else}
                    <Button
                            disabled={callbackUrl ? undefined : true}
                            href="https://lms.ssu.ac.kr/xn-sso/gw.php?login_type=sso&callback_url={encodeURIComponent(
              callbackUrl,
            )}"
                            rel="external"
                            class="h-16 w-full bg-primary-800 text-xl text-white"
                            isIconRight>
                        통합 로그인
                        <Soongsil class="h-8 w-8" slot="icon"/>
                    </Button>
                {/if}
                <div class="my-3 flex flex-row justify-between">
                    <Credit/>
                    <Button
                            on:click={() => (contactModalOpen = true)}
                            class="px-0 py-0 text-primary-800 underline !shadow-none hover:text-primary-900 hover:!shadow-none active:!shadow-none active:drop-shadow-md">
                        도움이 필요하신가요?
                    </Button>
                </div>
            </Entry>
        </NavigationContent>
        <NavigationFooter class="block lg:hidden">
            <div class="flex w-full items-center justify-center">
                <ChevronDown class="h-8 w-8 animate-bounce text-gray-700 ease-in-out"/>
            </div>
        </NavigationFooter>
    </Navigation>
    <div class="h-full w-full px-6 py-4 lg:px-8">
        {#if !errorData}
            <LockerStatus {lockerCount}/>
        {:else}
            <div class="h-full" transition:fade>
                <ErrorScreen
                        class="rounded-md p-4"
                        errorTitle={`${errorData.code}`}
                        errorMessage="오류가 발생하였습니다. 관리자에게 문의하십시오."/>
            </div>
        {/if}
    </div>
</Shell>

<Modal
        title="학과(부) 연락처"
        bind:open={contactModalOpen}
        secondaryClass="hidden"
        primaryText="닫기"
        on:close={() => (contactModalOpen = false)}
        on:click={() => (contactModalOpen = false)}>
    {#each departmentConfigs as conf}
        {#if conf.contact}
            <div class="my-2 leading-10">
                <h5>{conf.name} 연락처</h5>
                <p class="text-gray-700">{conf.contact}</p>
            </div>
        {/if}
    {:else}
        입력된 연락처가 없습니다.
    {/each}
    <Dismiss slot="primaryIcon"/>
</Modal>
