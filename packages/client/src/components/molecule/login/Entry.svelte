<script lang='ts'>

	export let name: string;

	let clazz = '';
	export { clazz as class };
</script>

<div class='{clazz} flex flex-col gap-10'>
	<div>{name}</div>
	<div>
		<h1 class='main-title'>사물함</h1>
		<h3 class='sub-title'>예약 시스템</h3>
	</div>
	<div>
		<slot />
	</div>
</div>