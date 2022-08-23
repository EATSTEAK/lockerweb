<script lang="ts">
    import Entry from '../components/molecule/login/Entry.svelte';
    import Button from '../components/atom/Button.svelte';
    import Soongsil from '../icons/Soongsil.svelte';
    import DepartmentLockerInfo from '../components/molecule/login/LockerStatus.svelte';
    import ChevronDown from '../icons/ChevronDown.svelte';
    import {browser} from '$app/env';
    import {getAuthorization} from '$lib/auth';
    import {config} from "$lib/store";
    import type {DepartmentLockerCount, LockerCount} from "$lib/types";
    import {variables} from "$lib/variables";
    import {getDepartmentLockerCountsByFloor} from "$lib/utils";

    let callbackUrl = undefined;

    let countData: LockerCountResponse;

    let lockerCount: LockerCount;

    $: callbackNotLoaded = true;
    $: mappedConfigsData = {};

    if (browser) {
        if (getAuthorization()) {
            window.location.href = '/reserve';
        }
        callbackUrl = window.location.protocol + '//' + window.location.host + '/callback';
        callbackNotLoaded = false;
        fetch(variables.baseUrl + '/api/v1/locker/count')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    countData = data.result;
                    console.log(countData);
                } else {
                    console.error(data.errorDescription);
                }
            })
            .catch((error) => console.error(error))
    }


    $: if ($config && countData) {
        // console.log('Data received');
        const mappedConfig: Record<string, Config> = Object.fromEntries($config.map<[string, Config]>((value) => [value.id, value]));
        lockerCount = updateLockerCount(mappedConfig, countData);
    }

    function updateLockerCount(configs: Record<string, Config>, countInfo: LockerCountResponse): LockerCount {
        const departmentConfigs = {...configs};
        delete departmentConfigs['SERVICE'];

        function transformLockerCount(
            serviceConfig: ServiceConfig,
            departmentConfig: DepartmentConfig,
            departmentCount?: { [floor: string]: number }
        ): DepartmentLockerCount {
            const floorLockers = getDepartmentLockerCountsByFloor(serviceConfig, departmentConfig.id);
            const totalLocker = Object.values(floorLockers).reduce<number>((a: number, v: number) => a + v, 0);
            const totalReserved = departmentCount ? Object.values(departmentCount).reduce<number>((a: number, v: number) => a + v, 0) : 0;
            const floors = Object.fromEntries(
                Object.entries(floorLockers).map(([floor, count]) => ([floor,
                    {
                        canReserve: count >= (departmentCount?.[floor] ?? 0),
                        percentage: Math.round(((departmentCount?.[floor] ?? 0) / count) * 100),
                        totalLocker: count,
                        lockerLeft: count - (departmentCount?.[floor] ?? 0)
                    }
                ]))
            )
            // console.log(departmentConfig.id, floorLockers);
            return {
                departmentName: departmentConfig.name,
                canReserve: (totalLocker > totalReserved),
                lockerLeft: (totalLocker - totalReserved),
                totalLocker,
                ...(departmentConfig.activateFrom && {availableFrom: departmentConfig.activateFrom}),
                ...(departmentConfig.activateTo && {availableFrom: departmentConfig.activateTo}),
                contact: departmentConfig.contact ?? '',
                floors
            };
        }

        return Object.fromEntries(Object.entries(departmentConfigs).map(([key, value]) => [key, transformLockerCount(configs.SERVICE as ServiceConfig, value, countInfo?.[key])]));
    }

</script>
<div class='root'>
    <div class='entry-wrap'>
        <div class='entry'>
            <Entry name='SOONGSIL UNIV. IT'>
                <Button
                        bind:disabled={callbackNotLoaded}
                        href='https://class.ssu.ac.kr/xn-sso/gw.php?login_type=sso&callback_url={encodeURIComponent(callbackUrl)}'
                        class='bg-primary-800 text-white w-full h-16 text-xl' isIconRight={true}>
                    통합 로그인
                    <Soongsil class='w-8 h-8' slot='icon'/>
                </Button>
            </Entry>
        </div>
        <div class='arrow'>
            <ChevronDown class='text-gray-700 w-8 h-8'/>
        </div>
    </div>
    <div class='info'>
        <DepartmentLockerInfo bind:lockerCount={lockerCount} />
    </div>
</div>


<style>
    .root {
        @apply flex flex-col md:flex-row items-stretch;
    }

    .arrow {
        @apply block md:hidden flex justify-center items-center -mt-10 pb-4;
    }

    .arrow {
        @apply animate-bounce ease-in-out;
    }

    .entry-wrap {
        @apply bg-gray-200 w-full md:min-w-[380px] md:w-[380px] flex flex-col justify-between;
    }

    .entry {
        @apply flex flex-col justify-center min-h-screen;
    }

    .info {
        @apply p-8 grow;
    }
</style>