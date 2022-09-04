/* eslint-disable import/extensions */
import type { Readable, StartStopNotifier } from 'svelte/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writable } from 'svelte/store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { browser, prerendering } from '$app/env';
import { getAuthorization } from '$lib/auth';
import { apiGetConfig, ConfigSchema } from '$lib/api/config';
import { apiGetUser } from '$lib/api/user';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

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

async function refreshConfig(
	forceFetch = false
): Promise<SuccessResponse<Config[]> | ErrorResponse<LockerError>> {
	if (browser) {
		if (localStorage.getItem('config') && !forceFetch) {
			const item = localStorage.getItem('config');
			if (item !== null) {
				const configStore: ConfigStore = JSON.parse(item);
				const lastUpdated = new Date(configStore.lastUpdated);
				const validated = z.array(ConfigSchema.passthrough()).safeParse(configStore.configs);
				if (Date.now() - lastUpdated.getTime() <= 1000 * 120 && validated.success) {
					return { success: true, result: validated.data as Config[] };
				}
			}
		}
		try {
			return await apiGetConfig().then((data) => {
				if (data.success) {
					const result: Config[] = data.result;
					localStorage.setItem(
						'config',
						JSON.stringify({
							lastUpdated: new Date().toISOString(),
							configs: result
						})
					);
					return data;
				} else {
					return data as ErrorResponse<NotFoundError>;
				}
			});
		} catch (e) {
			if (e.code && e.name) return { success: false, error: e };
			console.error(e);
			return {
				success: false,
				error: {
					code: 500,
					name: 'UnknownError',
					additionalInfo: e
				}
			};
		}
	}
	if (!prerendering) throw new Error('This function must be ran in browser');
}

async function refreshUser(): Promise<SuccessResponse<User> | ErrorResponse<LockerError>> {
	if (getAuthorization()) {
		try {
			return await apiGetUser().then((res) => {
				if (res.success) {
					return res;
				} else {
					return res as ErrorResponse<LockerError>;
				}
			});
		} catch (e) {
			if (e.code && e.name) return { success: false, error: e };
			console.error(e);
			return {
				success: false,
				error: {
					code: 500,
					name: 'UnknownError',
					additionalInfo: e
				}
			};
		}
	}
	return {
		success: false,
		error: {
			code: 401,
			name: 'Unauthorized'
		}
	};
}

export const config: Refreshable<
	SuccessResponse<Config[]> | undefined | ErrorResponse<LockerError>
> = refreshable<SuccessResponse<Config[]> | undefined | ErrorResponse<LockerError>>(
	undefined,
	(set) => {
		set(undefined);
		refreshConfig()
			.then((value) => set(value))
			.catch((e) => {
				console.error(e);
				set(null);
			});
		return function stop() {
			set(undefined);
		};
	},
	() => refreshConfig(true)
);

export const user: Refreshable<SuccessResponse<User> | undefined | ErrorResponse<LockerError>> =
	refreshable<SuccessResponse<User> | undefined | ErrorResponse<LockerError>>(
		undefined,
		(set) => {
			if (browser) {
				set(undefined);
				refreshUser()
					.then((value) => set(value))
					.catch((e) => {
						console.error(e);
						set(null);
					});
			}
			return function stop() {
				set(undefined);
			};
		},
		refreshUser
	);
