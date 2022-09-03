/* eslint-disable import/extensions */
import type { Readable, StartStopNotifier } from 'svelte/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writable } from 'svelte/store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { browser } from '$app/env';
import { getAuthorization } from '$lib/auth';
import { getConfig } from '$lib/api/config';
import { getUser } from '$lib/api/user';

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
			set(undefined);
			const result = refresher();
			if (typeof result === 'object' && typeof (result as Promise<T>).then === 'function') {
				(result as Promise<T>).then((v: T) => set(v));
			} else {
				set(result as T);
			}
		}
	};
}

async function refreshConfig(forceFetch = false): Promise<Config[] | LockerError> {
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
		try {
			return await getConfig().then((data) => {
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
					return (data as ErrorResponse<NotFoundError>).error;
				}
			});
		} catch (e) {
			if (e.code && e.name) return e;
			console.error(e);
			return {
				code: 500,
				name: 'UnknownError',
				additionalInfo: e
			};
		}
	}
	throw new Error('This function must be ran in browser');
}

async function refreshUser(): Promise<User | LockerError> {
	if (getAuthorization()) {
		try {
			return await getUser().then((res) => {
				if (res.success) {
					return res.result;
				} else {
					return (res as ErrorResponse<LockerError>).error;
				}
			});
		} catch (e) {
			if (e.code && e.name) return e;
			console.error(e);
			return {
				code: 500,
				name: 'UnknownError',
				additionalInfo: e
			};
		}
	}
	return {
		code: 401,
		name: 'Unauthorized'
	};
}

export const config: Refreshable<Config[] | undefined | LockerError> = refreshable<
	Config[] | undefined | LockerError
>(
	undefined,
	(set) => {
		set(undefined);
		refreshConfig().then((value) => set(value));
		return function stop() {
			set(undefined);
		};
	},
	() => refreshConfig(true)
);

export const user: Refreshable<User | undefined | LockerError> = refreshable<
	User | undefined | LockerError
>(
	undefined,
	(set) => {
		if (browser) {
			set(undefined);
			refreshUser().then((value) => set(value));
		}
		return function stop() {
			set(undefined);
		};
	},
	refreshUser
);
