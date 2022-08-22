<script lang='ts'>
	import { config } from '$lib/store';
	import DepartmentConfigEditor from '../department/DepartmentConfigEditor.svelte';

	$: configs = $config ? $config.filter((v) => v.id !== 'SERVICE') : [];
</script>

<div class='wrap'>
	<h3 class='title'>학부별 설정</h3>
	<div class='card'>
		<DepartmentConfigEditor {configs} />
	</div>
</div>

<style>
    .wrap {
        @apply my-8 md:mx-8 flex flex-col gap-3;
    }

    .title {
        @apply mx-6 md:mx-0;
    }

    .card {
        @apply md:rounded-md shadow-md p-6 bg-white flex flex-col gap-3;

    }
</style>