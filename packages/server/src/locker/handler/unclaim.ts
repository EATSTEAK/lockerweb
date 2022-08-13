import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { unclaimLocker } from '../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';

export const unclaimLockerHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let payload: JwtPayload;
	try {
		payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const id = payload.aud as string;
		const res = await unclaimLocker(id, token);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		if (!(isResponsibleError(e))) {
			console.error(e);
			const res = {
				success: false,
				error: 500,
				error_description: 'Internal error'
			};
			return createResponse(500, res);
		}
		return errorResponse(e as ResponsibleError);
	}
};