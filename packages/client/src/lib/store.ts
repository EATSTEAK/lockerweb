/* eslint-disable import/extensions */
import type { Readable } from 'svelte/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { readable } from 'svelte/store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { browser } from '$app/env';
import { variables } from '$lib/variables';
import { fetchWithAuth, getAuthorization } from '$lib/auth';

type ConfigStore = {
	lastUpdated: string;
	configs: Config[];
};

export const config: Readable<Config[] | undefined | null> = readable<Config[] | undefined | null>(
	undefined,
	(set) => {
		if (browser) {
			if (localStorage.getItem('config')) {
				const item = localStorage.getItem('config');
				if (item !== null) {
					const configStore: ConfigStore = JSON.parse(item);
					const lastUpdated = new Date(configStore.lastUpdated);
					if (Date.now() - lastUpdated.getTime() <= 1000 * 60) {
						set(configStore.configs);
					}
				}
			} else {
				set(undefined);
				fetch(variables.baseUrl + '/api/v1/config')
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							const result: Config[] = data.result;
							set(result);
						} else {
							throw new Error(`Request error ${data.error}: ${data.errorDescription}`);
						}
					})
					.catch((err) => {
						console.log(err);
						set(null);
					});
			}
		}
		return function stop() {
			set(undefined);
		};
	}
);

export const user: Readable<User | undefined | null> = readable<User | undefined | null>(
	undefined,
	(set) => {
		if (browser) {
			set(undefined);
			if (getAuthorization()) {
				fetchWithAuth(`${variables.baseUrl as string}/api/v1/user`)
					.then((res) => res.json())
					.then((res) => {
						if (res.success) {
							return res.result as User;
						}
						throw new Error(`Request error ${res.error}: ${res.error_description}`);
					})
					.then((info: User) => set(info))
					.catch((err) => {
						console.error(err);
						set(null);
					});
			} else {
				set(null);
			}
		}
		return function stop() {
			set(undefined);
		};
	}
);
