<script lang='ts'>
	import SubsectionEntry from './SubsectionEntry.svelte';
	import Button from '../../../atom/Button.svelte';
	import Add from '../../../../icons/Add.svelte';
	import { config } from '$lib/store';
	import { getDepartmentConfigs } from '$lib/api/config';

	$: departmentIds =
		$config && $config.success ? getDepartmentConfigs($config.result).map((v) => v.id) : [];

	export let subsections: LockerSubsection[];

	let newSubsections: LockerSubsection[] = [...subsections];

	$: if (subsections) {
		newSubsections = [...subsections];
	}

	function addSubsection() {
		newSubsections = [...newSubsections, { range: [0, 0], department: '' }];
	}

	function isValidSubsection(subsection: LockerSubsection) {
		return (
			typeof subsection.range[0] === 'number' &&
			typeof subsection.range[1] === 'number' &&
			subsection.range[0] <= subsection.range[1] &&
			departmentIds.includes(subsection.department)
		);
	}

	function removeSubsection(index: number) {
		newSubsections = newSubsections.filter((v, idx) => idx !== index);
		subsections = [...newSubsections.filter(isValidSubsection)];
	}

	function updateSubsection(index: number, evt: CustomEvent<LockerSubsection>) {
		newSubsections[index] = evt.detail;
		subsections = [...newSubsections.filter(isValidSubsection)];
	}
</script>

<div class='flex flex-col items-start'>
	<p class='text-xl font-bold'>세부 구역 설정</p>
	{#each newSubsections as subsection, index}
		<div class='my-1'>
			<SubsectionEntry
				on:remove={() => removeSubsection(index)}
				on:change={(evt) => updateSubsection(index, evt)}
				key={index}
				{subsection}
			/>
		</div>
	{/each}
	<Button on:click={addSubsection} class='bg-white' isIconRight>
		세부 구역 추가
		<Add slot='icon' />
	</Button>
</div>
