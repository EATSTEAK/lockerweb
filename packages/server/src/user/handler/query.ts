import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { createResponse } from '../../common';
import { assertAccessible } from '../../auth/data';
import { queryUser } from '../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';

export const queryUserHandler: APIGatewayProxyHandler = async (event) => {
	const startsWith = event.queryStringParameters?.starts ?? '';
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const id = (jwt.verify(token, JWT_SECRET) as JwtPayload).aud as string;
		await assertAccessible(id, token, true);
		const result = await queryUser(startsWith);
		return createResponse(200, {
			success: true,
			result
		});
	} catch (e) {
		if (isResponsibleError(e)) {
			return errorResponse(e as ResponsibleError);
		}
		console.error(e);
		return createResponse(500, {
			success: false,
			error: 500,
			description: 'Internal Error'
		});
	}
};
