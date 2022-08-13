<script lang='ts'>

	export let name: string;

	let clazz = '';
	export { clazz as class };
</script>

<div class={`wrap ${clazz || ''}`}>
	<div>{name}</div>
	<div>
		<h1 class='main-title'>사물함</h1>
		<h3 class='sub-title'>예약 시스템</h3>
	</div>
	<div>
		<slot />
		<a href='#'>도움이 필요하신가요?</a>
	</div>

</div>


<style>
    .wrap {
        @apply px-16 flex flex-col gap-10;
    }

    a {
        @apply text-primary-900 underline ml-2;
    }
</style>