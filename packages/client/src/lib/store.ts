/* eslint-disable import/extensions */
import type { Readable, StartStopNotifier } from 'svelte/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writable } from 'svelte/store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { browser } from '$app/env';
import { variables } from '$lib/variables';
import { fetchWithAuth, getAuthorization } from '$lib/auth';

type ConfigStore = {
	lastUpdated: string;
	configs: Config[];
};

export interface Refreshable<T> extends Readable<T> {
	refresh(this: void): void;
}

export function refreshable<T>(
	value?: T,
	start?: StartStopNotifier<T>,
	refresher?: () => T | Promise<T>
) {
	const { subscribe, set } = writable<T>(value, start);
	return {
		subscribe,
		refresh: () => {
			if (refresher === undefined) return;
			const result = refresher();
			if (typeof result === 'object' && typeof (result as Promise<T>).then === 'function') {
				(result as Promise<T>).then((v: T) => set(v));
			} else {
				set(result as T);
			}
		}
	};
}

async function refreshConfig(forceFetch = false): Promise<Config[]> {
	if (browser) {
		if (localStorage.getItem('config') && !forceFetch) {
			const item = localStorage.getItem('config');
			if (item !== null) {
				const configStore: ConfigStore = JSON.parse(item);
				const lastUpdated = new Date(configStore.lastUpdated);
				if (Date.now() - lastUpdated.getTime() <= 1000 * 60) {
					return configStore.configs;
				}
			}
		}
		const configs = await fetch(variables.baseUrl + '/api/v1/config')
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					const result: Config[] = data.result;
					localStorage.setItem(
						'config',
						JSON.stringify({
							lastUpdated: new Date().toISOString(),
							configs: result
						})
					);
					return result;
				} else {
					throw new Error(`Request error ${data.error}: ${data.errorDescription}`);
				}
			});
		return configs;
	}
	throw new Error('This function must be ran in browser');
}

async function refreshUser(): Promise<User> {
	if (getAuthorization()) {
		const result = await fetchWithAuth(`${variables.baseUrl as string}/api/v1/user`)
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					return res.result as User;
				}
				throw new Error(`Request error ${res.error}: ${res.errorDescription}`);
			});
		return result;
	}
	throw new Error('Unauthorized');
}

export const config: Refreshable<Config[] | undefined | null> = refreshable<
	Config[] | undefined | null
>(
	undefined,
	(set) => {
		set(undefined);
		refreshConfig()
			.then((value) => set(value))
			.catch((err) => {
				console.error(err);
				set(null);
			});
		return function stop() {
			set(undefined);
		};
	},
	() => refreshConfig(true)
);

export const user: Refreshable<User | undefined | null> = refreshable<User | undefined | null>(
	undefined,
	(set) => {
		if (browser) {
			set(undefined);
			refreshUser()
				.then((value) => set(value))
				.catch((err) => {
					console.error(err);
					set(null);
				});
		}
		return function stop() {
			set(undefined);
		};
	},
	refreshUser
);
