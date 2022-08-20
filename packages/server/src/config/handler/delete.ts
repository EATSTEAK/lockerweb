import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { createResponse } from '../../common';
import { assertAccessible } from '../../auth/data';
import { deleteConfig } from '../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';

export const deleteConfigHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let data: UserDeleteRequest;
	try {
		data = JSON.parse(event.body) as UserDeleteRequest;
	} catch {
		return createResponse(500, {
			success: false,
			error: 500,
			errorDescription: 'Data body is malformed JSON'
		});
	}
	if (!data || !data.id) {
		return createResponse(500, {
			success: false,
			error: 500,
			errorDescription: 'Internal error'
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
			errorDescription: 'Unauthorized'
		});
	}
	try {
		const id = payload.aud as string;
		await assertAccessible(id, token, true);
		if (data.id.toUpperCase() === 'SERVICE')
			return errorResponse(
				new ResponsibleError(500, 'Internal error', "Can't delete SERVICE config.")
			);
		const res = await deleteConfig(data.id);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		if (isResponsibleError(e)) {
			return errorResponse(e as ResponsibleError);
		}
		console.error(e);
		const res = {
			success: false,
			error: 500,
			errorDescription: 'Internal error'
		};
		return createResponse(500, res);
	}
};
