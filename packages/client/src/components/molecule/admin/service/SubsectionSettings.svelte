<script lang='ts'>
	import SubsectionEntry from '../../../atom/SubsectionEntry.svelte';
	import Button from '../../../atom/Button.svelte';
	import Add from '../../../../icons/Add.svelte';

	export let subsections: LockerSubsection[];
</script>

<div class='wrap'>
	<p class='text-xl font-bold'>세부 구역 설정</p>
	{#each subsections as subsection}
		<div class='my-1'>
			<SubsectionEntry subsection={subsection} />
		</div>
	{/each}
	<Button class='bg-white' isIconRight>
		추가
		<Add slot='icon' />
	</Button>
</div>

<style>
    .wrap {
        @apply flex flex-col items-start;

    }
</style>