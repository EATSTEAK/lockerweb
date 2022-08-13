import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { updateUser } from '../data';
import { assertAccessible } from '../../auth/data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';

export const updateUserHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let data: UserUpdateRequest;
	try {
		data = JSON.parse(event.body) as UserUpdateRequest;
	} catch {
		return createResponse(500, {
			success: false,
			error: 500,
			error_description: 'Data body is malformed JSON'
		});
	}
	if (!data || !data.id) {
		return createResponse(500, {
			success: false,
			error: 500,
			error_description: 'Internal error'
		});
	}
	let payload: JwtPayload;
	try {
		payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch {
		console.debug('malformed token');
		return createResponse(401, {
			success: false,
			error: 401,
			error_description: 'Unauthorized'
		});
	}
	try {
		const id = payload.aud as string;
		await assertAccessible(id, token, true);
		await updateUser(data);
		return createResponse(200, { success: true });
	} catch (e) {
		if (isResponsibleError(e)) {
			return errorResponse(e as ResponsibleError);
		}
		console.error(e);
		const res = {
			success: false,
			error: 500,
			error_description: 'Internal error'
		};
		return createResponse(500, res);
	}
};