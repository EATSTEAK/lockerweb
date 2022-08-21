<script lang='ts'>
	import Subtract from '../../icons/Subtract.svelte';
	import { config } from '$lib/store';

	export let subsection: LockerSubsection;

	$: departments = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];
</script>

<div class='wrap'>
	<div class='remove'>
		<button class='remove-btn'>
			<Subtract />
		</button>
	</div>
	<div class='range'>
		<label>세부 구역 범위</label>
		<input type='number' class='form-input bg-gray-100 border-transparent focus:bg-white w-24' id='range-start'
					 value={subsection?.range?.[0] ?? 0} />
		<div class='p-2'>~</div>
		<input type='number' class='form-input bg-gray-100 border-transparent focus:bg-white w-24' id='range-end'
					 value={subsection?.range?.[1] ?? 0} />
	</div>
	<div class='department'>
		<label>대상 학부</label>
		<select class='bg-gray-100 border-transparent focus:bg-white' required>
			{#each departments as department}
				<option value={department.id} selected={subsection?.department === department.id}>{department.name}</option>
			{/each}
		</select>
	</div>

</div>

<style>
    label {
        @apply font-bold mr-2;
    }

    .wrap {
        @apply flex items-center gap-3 bg-white rounded-md overflow-hidden p-1;
    }

    .wrap:hover {
        @apply brightness-95;

    }

    .range {
        @apply rounded-md overflow-hidden flex items-center;
    }

    .remove {
        @apply flex items-center;
    }

    .remove-btn {
        @apply rounded-md bg-gray-200 text-gray-500;
    }

    .remove-btn:hover {
        @apply brightness-90;
    }
</style>