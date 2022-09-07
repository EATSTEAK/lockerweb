// eslint-disable-next-line import/extensions
import { getCookieValue } from '$lib/utils';

export const getAuthorization = () => getCookieValue('locker_session');

export const deleteAuthorization = () =>
	(document.cookie = `locker_session=; path=/; domain=${window.location.hostname}; max-age=-99999999; samesite=lax;`);

export const fetchWithAuth = (resource: RequestInfo, init?: RequestInit) =>
	fetch(resource, {
		...init,
		headers: {
			Authorization: `Bearer ${getAuthorization()}`,
			...init?.headers
		}
	});
