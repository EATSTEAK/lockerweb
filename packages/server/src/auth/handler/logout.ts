import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { assertAccessible, revokeToken } from '../data';
import { createResponse } from '../../common';
import { ResponsibleError } from '../../util/error';

export const logoutHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		await assertAccessible(payload.aud as string, token);
		const res = await revokeToken(payload.aud as string, token);
		return createResponse(200, { success: true, ...res });
	} catch (err) {
		if (err instanceof ResponsibleError) {
			return err.response();
		}
		const res = {
			success: false,
			token,
			error: 401,
			error_description: 'Unauthorized'
		};
		return createResponse(401, res);
	}
};