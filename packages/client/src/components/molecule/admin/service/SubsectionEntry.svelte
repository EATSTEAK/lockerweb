<script lang='ts'>
	import Subtract from '../../../../icons/Subtract.svelte';
	import { config } from '$lib/store';
	import NumberInput from '../../../atom/form/NumberInput.svelte';
	import Select from '../../../atom/form/Select.svelte';
	import { createEventDispatcher } from 'svelte';
	import isEqual from 'lodash.isequal';

	export let key: string;
	export let subsection: LockerSubsection;

	const dispatch = createEventDispatcher<{
		remove: {},
		change: LockerSubsection
	}>();

	$: departments = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];

	let rangeStart = subsection?.range?.[0] ?? 0;
	let rangeEnd = subsection?.range?.[1] ?? 0;
	let department = subsection?.department;
	let invalidText: string;

	$: if (subsection) {
		initializeValues();
	}

	$: if (rangeStart && rangeEnd && department) {
		if (rangeStart <= 0) {
			invalidText = '값 무시됨: 구역 시작은 1보다 커야함';
		} else if (rangeStart > rangeEnd) {
			invalidText = '값 무시됨: 구역 시작이 끝보다 큼';
		} else if (!departments.find((d) => d.id === department)) {
			invalidText = '값 무시됨: 존재하지 않는 학부';
		} else {
			invalidText = undefined;
			const newSubsection = {
				range: [rangeStart, rangeEnd],
				department
			};
			if (!isEqual(subsection, newSubsection)) dispatch('change', newSubsection);
		}
	} else {
		invalidText = '값 무시됨: 모든 값이 입력되지 않음';
	}

	function initializeValues() {
		rangeStart = subsection?.range?.[0] ?? 0;
		rangeEnd = subsection?.range?.[1] ?? 0;
		department = subsection?.department;
		invalidText = undefined;
	}

	function removeSubsection() {
		dispatch('remove', {});
	}
</script>

<div class='wrap'>
	<div class='entry'>
		<div class='remove'>
			<button on:click={removeSubsection} class='remove-btn'>
				<Subtract />
			</button>
		</div>
		<div class='inputs-wrap'>
			<div class='range'>
				<label>세부 구역 범위</label>
				<div class='range-input'>
					<NumberInput id='range-start' class='w-24' label='세부 구역 시작' bind:value={rangeStart} />
					<div class='p-2'>~</div>
					<NumberInput id='range-end' class='w-24' label='세부 구역 끝' bind:value={rangeEnd} />
				</div>
			</div>
			<div class='department'>
				<label>대상 학부</label>
				<Select id={`subsection_${key}_department`} label='대상 학부' bind:value={department} required>
					{#each departments as department}
						<option value={department.id}>{department.name}</option>
					{/each}
				</Select>
			</div>
		</div>
	</div>
	{#if invalidText}
		<p class='text-red-800'>{invalidText}</p>
	{/if}
</div>


<style>
    .wrap {
        @apply transition-all bg-white rounded-md flex flex-col gap-1;
    }

    .wrap:hover {
        @apply brightness-95;
    }

    label {
        @apply font-bold mr-2;
    }

    .entry {
        @apply transition-all flex items-center gap-3 overflow-hidden p-1;
    }

    .inputs-wrap {
        @apply flex flex-wrap items-center gap-3;
    }

    .range {
        @apply rounded-md overflow-hidden flex items-center flex-wrap;
    }

    .department {
        @apply flex items-center flex-wrap;
    }

    .range-input {
        @apply flex items-center;
    }

    .remove {
        @apply flex items-center;
    }

    .remove-btn {
        @apply transition-all rounded-md bg-gray-200 text-gray-500;
    }

    .remove-btn:hover {
        @apply brightness-90;
    }
</style>