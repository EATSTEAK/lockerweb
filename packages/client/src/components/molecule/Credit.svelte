<script lang='ts'>
	import GitHub from '../../icons/brands/GitHub.svelte';
	import Button from '../atom/Button.svelte';
	import Modal from './Modal.svelte';
	import Svelte from '../../icons/brands/Svelte.svelte';
	import TailwindCss from '../../icons/brands/TailwindCss.svelte';
	import Heart from '../../icons/Heart.svelte';
	import Divider from '../atom/Divider.svelte';
	import AwsLambda from '../../icons/brands/AwsLambda.svelte';
	import AmazonDynamoDB from '../../icons/brands/AmazonDynamoDB.svelte';
	import AmazonAPIGateway from '../../icons/brands/AmazonAPIGateway.svelte';
	import AmazonS3 from '../../icons/brands/AmazonS3.svelte';
	import Dismiss from '../../icons/Dismiss.svelte';
	import Eatsteak from '../../icons/creator/Eatsteak.svelte';
	import Twince from '../../icons/creator/Twince.svelte';

	let open = false;
</script>

<section class='flex gap-1 items-center'>
	<a
		class='text-gray-500 hover:text-gray-800'
		rel='external'
		target='_blank'
		href='https://github.com/EATSTEAK/lockerweb'
	>
		<GitHub />
	</a>
	<Button
		on:click={() => (open = true)}
		class='!shadow-none text-gray-500 hover:!shadow-none hover:text-gray-800 active:!shadow-none active:drop-shadow-md'
	>
		정보
	</Button>
</section>

<Modal
	title='정보'
	bind:open
	on:close={() => (open = false)}
	on:click:secondary={() => (open = false)}
	on:click={() => window.open('https://github.com/EATSTEAK/lockerweb', '_blank').focus()}
	primaryText='GitHub'
	secondaryText='닫기'
>
	<h4 class='text-gray-700 text-center'>숭실대학교 사물함 시스템</h4>
	<Divider class='my-2' />
	<div class='mb-5 font-medium leading-10'>
		<p class='text-gray-500 text-center'>
			숭실대학교 학우들의 사물함 신청을 편리하게 하기 위한 시스템
		</p>
		<div class='flex flex-row justify-center items-center gap-1'>
			<a href='https://github.com/EATSTEAK/lockerweb/releases'
			><img
				alt='Version'
				src='https://img.shields.io/github/package-json/v/EATSTEAK/lockerweb?style=for-the-badge'
			/></a
			>
			<a href='https://github.com/EATSTEAK/lockerweb/LICENSE.md'
			><img
				alt='License'
				src='https://img.shields.io/github/license/EATSTEAK/lockerweb?style=for-the-badge'
			/></a
			>
		</div>
	</div>
	<div class='my-5 font-medium leading-10'>
		<p class='text-gray-500 text-center'>Made by</p>
		<div class='flex flex-row justify-center items-center gap-2 text-gray-500'>
			<Button
				href='https://github.com/EATSTEAK'
				rel='external'
				target='_blank'
				aria-label='EATSTEAK'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#FF8C00]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<Eatsteak />
			</Button>
			<Button
				href='https://github.com/Twince'
				rel='external'
				target='_blank'
				aria-label='Twince'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#F38630]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<Twince />
			</Button>
		</div>
	</div>
	<div class='my-5 font-medium leading-10'>
		<p class='text-gray-500 text-center'>Special Thanks</p>
		<div class='flex flex-row justify-center items-center gap-2 text-gray-500'>
			<Button
				href='https://github.com/TEAM-MAT'
				rel='external'
				target='_blank'
				aria-label='TEAM-MAT'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-gray-700
				active:!shadow-none active:brightness-95'
			>
				TEAM-MAT
			</Button>
		</div>
	</div>
	<div class='my-5 font-medium leading-10'>
		<p class='text-gray-500 text-center'>Made with</p>
		<div class='flex flex-row justify-center items-center gap-2 text-gray-500'>
			<Button
				href='https://svelte.dev'
				rel='external'
				target='_blank'
				aria-label='Svelte'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#FF3E00]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<Svelte />
			</Button>
			<Button
				href='https://tailwindcss.com'
				rel='external'
				target='_blank'
				aria-label='Tailwind CSS'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#38BDF8]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<TailwindCss />
			</Button>
			<Button
				href='https://aws.amazon.com/lambda/'
				rel='external'
				target='_blank'
				aria-label='AWS Lambda'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#FF9900]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<AwsLambda />
			</Button>
			<Button
				href='https://aws.amazon.com/dynamodb/'
				rel='external'
				target='_blank'
				aria-label='Amazon DynamoDB'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#4053D6]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<AmazonDynamoDB />
			</Button>
			<Button
				href='https://aws.amazon.com/api-gateway/'
				rel='external'
				target='_blank'
				aria-label='Amazon API Gateway'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#FF4F8B]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<AmazonAPIGateway />
			</Button>
			<Button
				href='https://aws.amazon.com/s3/'
				rel='external'
				target='_blank'
				aria-label='Amazon S3'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-[#569A31]
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
			>
				<AmazonS3 />
			</Button>
		</div>
	</div>
	<div class='mt-10 mb-2 font-medium leading-10'>
		<p class='text-gray-500 text-center'>and...</p>
		<div class='flex flex-row justify-center items-center gap-1 text-gray-500'>
			<Button
				aria-label='Love'
				class='px-0 py-0 !shadow-none
				hover:!shadow-none hover:text-rose-600
				active:!shadow-none active:brightness-95
				after:content-[attr(aria-label)] tooltip'
				on:click={() => showLove = true}
			>
				<Heart />
			</Button>
		</div>
	</div>
	<Dismiss slot='secondaryIcon' />
	<GitHub slot='primaryIcon' />
</Modal>

<style>
    :global(.tooltip) {
        @apply hover:after:opacity-100 hover:after:visible;
    }

    :global(.tooltip::after) {
        @apply transition-all invisible opacity-0
        bg-gray-800 bg-opacity-75 rounded-xl
        text-white absolute top-full left-1/2 px-2
        -translate-x-1/2 w-max;
    }
</style>
