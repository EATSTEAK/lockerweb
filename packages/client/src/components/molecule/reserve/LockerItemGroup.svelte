<script lang='ts'>
	import { afterUpdate, createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let selectedIndex = 0;
	export let widthScale: number;
	export let heightScale: number;

	const dispatch = createEventDispatcher();
	const currentId = writable(null);

	export let selectedId = undefined;

	$: currentIndex = -1;
	$: items = [];

	$: if (items[currentIndex]) {
		dispatch('change', currentIndex);
		currentId.set(items[currentIndex].id);
		selectedId = items[currentIndex].id;
	}

	setContext('LockerGroup', {
		currentId,
		add: ({ id, selected }) => {
			if (selected) {
				selectedIndex = items.length;
			}

			items = [...items, { id, selected }];
		},
		update: (id) => {
			selectedIndex = items.map(({ id }) => id).indexOf(id);
		},
		change: (direction) => {
			let index = currentIndex + direction;

			if (index < 0) {
				index = items.length - 1;
			} else if (index >= items.length) {
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

<div class='flex flex-col flex-wrap mt-2 ml-auto mr-auto' style={`width:${widthScale}rem; height:${heightScale}rem;`}>
	<slot />
</div>
