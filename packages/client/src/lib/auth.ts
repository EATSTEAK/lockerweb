// eslint-disable-next-line import/extensions
import { getCookieValue } from '$lib/utils';

export const getAuthorization = () => getCookieValue('locker_session');

export const fetchWithAuth = (resource: RequestInfo, init?: RequestInit) =>
	fetch(resource, {
		...init,
		headers: {
			Authorization: `Bearer ${getAuthorization()}`,
			...init?.headers
		}
	});
