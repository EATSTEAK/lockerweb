import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../env';
import { createResponse } from '../../../common';
import { assertAccessible } from '../../../auth/data';
import { batchPutUser } from '../../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../../util/error';

export const batchPutUserHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let data: User[];
	try {
		data = JSON.parse(event.body) as User[];
	} catch {
		return createResponse(500, {
			success: false,
			error: 500,
			errorDescription: 'Data body is malformed JSON'
		});
	}
	if (!data || !Array.isArray(data)) {
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
	let i = 0;
	try {
		const id = payload.aud as string;
		await assertAccessible(id, token, true);
		for (i = 0; i < data.length; i += 25) {
			const partialData = data.slice(i, i + 25);
			await batchPutUser(partialData);
		}
		return createResponse(200, { success: true });
	} catch (e) {
		if (isResponsibleError(e)) {
			(e as ResponsibleError).additionalInfo.failed_data = data.slice(i, data.length);
			return errorResponse(e as ResponsibleError);
		}
		console.error(e);
		const res = {
			success: false,
			error: 500,
			errorDescription: 'Internal error',
			failed_data: JSON.stringify(data.slice(i, data.length))
		};
		return createResponse(500, res);
	}
};
