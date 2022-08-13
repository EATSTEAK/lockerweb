<script lang='ts'>
	import { afterUpdate, createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let selectedIndex = 0;

	const dispatch = createEventDispatcher();
	const currentId = writable(null);

	export let selectedId = undefined;

	$: currentIndex = -1;
	$: departments = [];

	$: if (departments[currentIndex]) {
		dispatch('change', currentIndex);
		currentId.set(departments[currentIndex].id);
		selectedId = departments[currentIndex].id;
	}

	setContext('DepartmentSelectionGroup', {
		currentId,
		add: ({ id, selected }) => {
			if (selected) {
				selectedIndex = departments.length;
			}

			departments = [...departments, { id, selected }];
		},
		update: (id) => {
			selectedIndex = departments.map(({ id }) => id).indexOf(id);
		},
		change: (direction) => {
			let index = currentIndex + direction;

			if (index < 0) {
				index = departments.length - 1;
			} else if (index >= departments.length) {
				index = 0;
			}

			selectedIndex = index;
		}
	});

	afterUpdate(() => {
		if (selectedIndex !== currentIndex) {
			currentIndex = selectedIndex;
		}
	});
</script>

<slot />

<style>

</style>