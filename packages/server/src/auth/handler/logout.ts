import type { APIGatewayProxyHandler } from 'aws-lambda';
import { assertAccessible, revokeToken } from '../data';
import { createResponse } from '../../common';
import { responseAsResponsibleError, UnauthorizedError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const logoutHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const payload = verifyPayload(token);
		await assertAccessible(payload.aud as string, token);
		const res = await revokeToken(payload.aud as string, token);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		responseAsResponsibleError(
			e,
			new UnauthorizedError("Can't logout when not logged in", { token })
		);
	}
};
