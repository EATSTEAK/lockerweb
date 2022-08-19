import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { createResponse } from '../../common';
import { queryLockers } from '../data';
import { assertAccessible } from '../../auth/data';

export const queryClaimedLockersHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	const showId = event.queryStringParameters?.show_id === 'true';
	let id: string;
	try {
		const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		id = payload.aud as string;
	} catch {
		return createResponse(401, {
			success: false,
			error: 401,
			errorDescription: 'Unauthorized'
		});
	}
	await assertAccessible(id, token, showId);
	const result = await queryLockers('', showId);
	return createResponse(200, {
		success: true,
		result
	});
};
