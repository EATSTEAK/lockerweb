<script lang="ts">
  import GitHub from '../../icons/brands/GitHub.svelte';
  import Button from '../atom/Button.svelte';
  import Heart from '../../icons/Heart.svelte';
  import { scale } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import Modal from './Modal.svelte';
  import Divider from '../atom/Divider.svelte';
  import Eatsteak from '../../icons/creator/Eatsteak.svelte';
  import Twince from '../../icons/creator/Twince.svelte';
  import Dismiss from '../../icons/Dismiss.svelte';
  import Svelte from '../../icons/brands/Svelte.svelte';
  import TailwindCss from '../../icons/brands/TailwindCss.svelte';
  import AwsLambda from '../../icons/brands/AwsLambda.svelte';
  import AmazonDynamoDB from '../../icons/brands/AmazonDynamoDB.svelte';
  import AmazonAPIGateway from '../../icons/brands/AmazonAPIGateway.svelte';
  import AmazonS3 from '../../icons/brands/AmazonS3.svelte';

  let open = false;

  let showLove = false;
  let noLove = true;
</script>

<section class="flex items-center gap-1">
  <a
    class="text-gray-500 hover:text-gray-800"
    rel="external"
    target="_blank"
    href="https://github.com/EATSTEAK/lockerweb">
    <GitHub />
  </a>
  <Button
    on:click={() => (open = true)}
    class="text-gray-500 !shadow-none hover:text-gray-800 hover:!shadow-none active:!shadow-none active:drop-shadow-md">
    정보
  </Button>
</section>

{#if showLove}
  <div
    in:scale={{ duration: 500, easing: backInOut }}
    out:scale={{ duration: 500, delay: 1000, easing: backInOut }}
    on:introstart={() => (noLove = false)}
    on:outroend={() => (noLove = true)}
    on:introend={() => (showLove = false)}
    class="fixed top-0 left-0 z-[9999] flex h-full w-full items-center justify-center">
    <Heart class="h-[50vw] w-[50vw] text-rose-600" />
  </div>
{/if}

<Modal
  title="정보"
  bind:open
  class={!noLove ? 'opacity-0' : ''}
  on:close={() => (open = false)}
  on:click:secondary={() => (open = false)}
  on:click={() => window.open('https://github.com/EATSTEAK/lockerweb', '_blank').focus()}
  primaryText="GitHub"
  secondaryText="닫기">
  <h4 class="text-center text-gray-700">숭실대학교 사물함 시스템</h4>
  <Divider class="my-2" />
  <div class="mb-5 font-medium leading-10">
    <p class="text-center text-gray-500">
      숭실대학교 학우들의 사물함 신청을 편리하게 하기 위한 시스템
    </p>
    <div class="flex flex-row items-center justify-center gap-1">
      <a href="https://github.com/EATSTEAK/lockerweb/releases"
        ><img
          alt="Version"
          src="https://img.shields.io/github/package-json/v/EATSTEAK/lockerweb?style=for-the-badge" /></a>
      <a href="https://github.com/EATSTEAK/lockerweb/LICENSE.md"
        ><img
          alt="License"
          src="https://img.shields.io/github/license/EATSTEAK/lockerweb?style=for-the-badge" /></a>
    </div>
  </div>
  <div class="my-5 font-medium leading-10">
    <p class="text-center text-gray-500">Made by</p>
    <div class="flex flex-row items-center justify-center gap-2 text-gray-500">
      <Button
        href="https://github.com/EATSTEAK"
        rel="external"
        target="_blank"
        aria-label="EATSTEAK"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#FF8C00] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <Eatsteak />
      </Button>
      <Button
        href="https://github.com/Twince"
        rel="external"
        target="_blank"
        aria-label="Twince"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#F38630] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <Twince />
      </Button>
    </div>
  </div>
  <div class="my-5 font-medium leading-10">
    <p class="text-center text-gray-500">Special Thanks</p>
    <div class="flex flex-row items-center justify-center gap-2 text-gray-500">
      <Button
        href="https://github.com/TEAM-MAT"
        rel="external"
        target="_blank"
        aria-label="TEAM-MAT"
        class="px-0 py-0 !shadow-none
				hover:text-gray-700 hover:!shadow-none
				active:!shadow-none active:brightness-95">
        TEAM-MAT
      </Button>
    </div>
  </div>
  <div class="my-5 font-medium leading-10">
    <p class="text-center text-gray-500">Powered by</p>
    <div class="flex flex-row items-center justify-center gap-2 text-gray-500">
      <Button
        href="https://svelte.dev"
        rel="external"
        target="_blank"
        aria-label="Svelte"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#FF3E00] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <Svelte />
      </Button>
      <Button
        href="https://tailwindcss.com"
        rel="external"
        target="_blank"
        aria-label="Tailwind CSS"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#38BDF8] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <TailwindCss />
      </Button>
      <Button
        href="https://aws.amazon.com/lambda/"
        rel="external"
        target="_blank"
        aria-label="AWS Lambda"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#FF9900] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <AwsLambda />
      </Button>
      <Button
        href="https://aws.amazon.com/dynamodb/"
        rel="external"
        target="_blank"
        aria-label="Amazon DynamoDB"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#4053D6] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <AmazonDynamoDB />
      </Button>
      <Button
        href="https://aws.amazon.com/api-gateway/"
        rel="external"
        target="_blank"
        aria-label="Amazon API Gateway"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#FF4F8B] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <AmazonAPIGateway />
      </Button>
      <Button
        href="https://aws.amazon.com/s3/"
        rel="external"
        target="_blank"
        aria-label="Amazon S3"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-[#569A31] hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <AmazonS3 />
      </Button>
    </div>
  </div>
  <div class="mt-10 mb-2 font-medium leading-10">
    <p class="text-center text-gray-500">and...</p>
    <div class="flex flex-row items-center justify-center gap-1 text-gray-500">
      <Button
        aria-label="Love"
        class="tooltip px-0 py-0
				!shadow-none after:content-[attr(aria-label)]
				hover:text-rose-600 hover:!shadow-none
				active:!shadow-none active:brightness-95">
        <Heart
          on:click={() => {
            showLove = true;
          }} />
      </Button>
    </div>
  </div>
  <Dismiss slot="secondaryIcon" />
  <GitHub slot="primaryIcon" />
</Modal>

<style lang="postcss">
  :global(.tooltip) {
    @apply hover:after:visible hover:after:opacity-100;
  }

  :global(.tooltip::after) {
    @apply invisible absolute top-full
        left-1/2 w-max -translate-x-1/2
        rounded-xl bg-gray-800 bg-opacity-75 px-2 text-white
        opacity-0 transition-all;
  }
</style>
