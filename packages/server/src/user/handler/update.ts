import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { updateUser } from '../data';
import { assertAccessible } from '../../auth/data';
import { BadRequestError, errorResponse, responseAsLockerError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const updateUserHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let data: UserUpdateRequest;
	try {
		data = JSON.parse(event.body) as UserUpdateRequest;
	} catch {
		return errorResponse(new BadRequestError('Request body is malformed JSON'));
	}
	if (!data || !data.id) {
		return errorResponse(new BadRequestError('Request body must contains "id" field'));
	}
	try {
		const payload = verifyPayload(token);
		const id = payload.aud as string;
		await assertAccessible(id, token, true);
		await updateUser(data);
		return createResponse(200, { success: true });
	} catch (e) {
		return responseAsLockerError(e);
	}
};
