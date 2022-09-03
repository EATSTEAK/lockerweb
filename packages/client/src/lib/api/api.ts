import { fetchWithAuth } from '../auth';
import { variables } from '../variables';

export async function apiRequest<T>(
	endpoint: string,
	withAuth = false,
	postBody?: unknown
): Promise<SuccessResponse<T> | ErrorResponse<LockerError>> {
	let response;
	try {
		if (withAuth) {
			response = await fetchWithAuth(variables.baseUrl + '/api/v1' + endpoint, {
				method: postBody ? 'POST' : 'GET',
				...(postBody && { body: JSON.stringify(postBody) })
			}).then((res) => res.json());
		} else {
			response = await fetch(variables.baseUrl + endpoint, {
				method: postBody ? 'POST' : 'GET',
				...(postBody && { body: JSON.stringify(postBody) })
			}).then((res) => res.json());
		}
	} catch (e) {
		console.error(e);
		return {
			success: false,
			error: {
				code: 500,
				name: 'FetchError',
				additionalInfo: e
			}
		};
	}
	if (Object.keys(response).includes('success')) {
		if (response.success) {
			return response as SuccessResponse<T>;
		}
		return response as ErrorResponse<LockerError>;
	}
	return {
		success: false,
		error: {
			code: 500,
			name: 'UnknownError',
			additionalInfo: response
		}
	};
}
