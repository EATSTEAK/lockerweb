import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { createResponse } from '../../common';
import { getUser } from '../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';

export const getUserHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const id = (jwt.verify(token, JWT_SECRET) as JwtPayload).aud as string;
		const result = await getUser(id);
		return createResponse(200, {
			success: true,
			result
		});
	} catch (e) {
		if (isResponsibleError(e)) {
			return errorResponse(e as ResponsibleError);
		}
		if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
			return createResponse(401, {
				success: false,
				error: 401,
				description: 'Unauthorized'
			});
		}
		console.error(e);
		return createResponse(500, {
			success: false,
			error: 500,
			description: 'Internal Error'
		});
	}
};