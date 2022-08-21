<script lang='ts'>
	import Subtract from '../../icons/Subtract.svelte';
	import { config } from '$lib/store';
	import NumberInput from './form/NumberInput.svelte';
	import Select from './form/Select.svelte';

	export let subsection: LockerSubsection;

	$: departments = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];
</script>

<div class='wrap'>
	<div class='remove'>
		<button class='remove-btn'>
			<Subtract />
		</button>
	</div>
	<div class='inputs-wrap'>
		<div class='range'>
			<label>세부 구역 범위</label>
			<div class='range-input'>
				<NumberInput id='range-start' class='w-24' label='세부 구역 시작' value={subsection?.range?.[0] ?? 0} />
				<div class='p-2'>~</div>
				<NumberInput id='range-end' class='w-24' label='세부 구역 끝' value={subsection?.range?.[1] ?? 0} />
			</div>
		</div>
		<div class='department'>
			<label>대상 학부</label>
			<Select required>
				{#each departments as department}
					<option value={department.id} selected={subsection?.department === department.id}>{department.name}</option>
				{/each}
			</Select>
		</div>
	</div>
</div>

<style>
    label {
        @apply font-bold mr-2;
    }

    .wrap {
        @apply transition-all flex items-center gap-3 bg-white rounded-md overflow-hidden p-1;
    }

    .wrap:hover {
        @apply brightness-95;
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