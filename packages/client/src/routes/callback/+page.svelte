<script lang="ts">
  import Entry from '../../components/molecule/login/Entry.svelte';
  import ChevronDown from '../../icons/ChevronDown.svelte';
  import ArrowClockwise from '../../icons/ArrowClockwise.svelte';
  import Button from '../../components/atom/Button.svelte';
  import { browser } from '$app/env';
  import NavigationFooter from '../../components/atom/NavigationFooter.svelte';
  import Shell from '../../components/molecule/Shell.svelte';
  import Navigation from '../../components/molecule/Navigation.svelte';
  import NavigationContent from '../../components/atom/NavigationContent.svelte';
  import PageTitle from '../../components/atom/PageTitle.svelte';
  import type { LoginSuccessResponse } from '$lib/api/auth';
  import { apiSsuLogin } from '$lib/api/auth';
  import ErrorCircle from '../../icons/ErrorCircle.svelte';
  import Checkmark from '../../icons/Checkmark.svelte';
  import ErrorScreen from '../../components/atom/ErrorScreen.svelte';
  import { goto } from '$app/navigation';
  import { user } from '$lib/store';

  let result: string;
  let response:
    | SuccessResponse<LoginSuccessResponse>
    | ErrorResponse<UnauthorizedError | BlockedError>;
  let id: Promise<
    SuccessResponse<LoginSuccessResponse> | ErrorResponse<UnauthorizedError | BlockedError>
  >;

  let errorMessage: string;

  $: if (response && response.success === false) {
    if (response.error.name === 'Blocked') {
      errorMessage = '현재는 접속할 수 없는 시간입니다. 운영 시간을 확인하세요.';
    } else if (response.error.name == 'Forbidden') {
      errorMessage = '등록되지 않은 사용자입니다. 관리자에게 문의하세요.';
    } else if (response.error.name === 'Unauthorized') {
      errorMessage = '인증 토큰이 올바르지 않습니다. 인증 토큰을 확인하세요.';
    } else {
      errorMessage = '알 수 없는 오류입니다. 관리자에게 문의하세요.';
    }
  }

  if (browser) {
    result = new URLSearchParams(window.location.search).get('result');
    id = apiSsuLogin(result);
    id.then((data) => {
      response = data;
      if (data.success) {
        const { accessToken, expiresIn } = data.result;
        document.cookie = `locker_session=${encodeURIComponent(accessToken)}; path=/; domain=${
          window.location.hostname
        }; max-age=${expiresIn}; samesite=lax`;
        user.refresh();
        goto('/reserve');
      } else {
        setTimeout(() => goto('/', { replaceState: true }), 5000);
      }
    }).catch((err) => {
      response = err;
      console.error(err);
    });
  }
</script>

<PageTitle name="로그인 중..." />

<Shell>
  <Navigation slot="navigation" class="h-full min-h-screen w-full" collapsable={false}>
    <NavigationContent>
      <Entry class="h-full grow justify-center" name="SOONGSIL UNIV. IT">
        {#if !response}
          <Button disabled class="h-16 w-full bg-primary-800 text-xl text-white" isIconRight>
            로그인 중...
            <ArrowClockwise class="animate-spin" slot="icon" />
          </Button>
        {:else if !response.success}
          <Button disabled class="h-16 w-full bg-red-800 text-xl text-white" isIconRight>
            로그인 실패
            <ErrorCircle class="animate-spin" slot="icon" />
          </Button>
        {:else if response.success}
          <Button disabled class="h-16 w-full bg-green-800 text-xl text-white" isIconRight>
            로그인 성공
            <Checkmark slot="icon" />
          </Button>
        {/if}
      </Entry>
    </NavigationContent>
    <NavigationFooter class="block lg:hidden">
      <div class="flex w-full items-center justify-center">
        <ChevronDown class="h-8 w-8 animate-bounce text-gray-700 ease-in-out" />
      </div>
    </NavigationFooter>
  </Navigation>
  {#if response && response.success === false}
    <ErrorScreen errorTitle={`${response.error.code}`} {errorMessage} />
  {/if}
</Shell>
