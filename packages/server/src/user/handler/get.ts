import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { getUser } from '../data';
import { responseAsResponsibleError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const getUserHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const id = verifyPayload(token).aud as string;
		const result = await getUser(id);
		return createResponse(200, {
			success: true,
			result
		});
	} catch (e) {
		responseAsResponsibleError(e);
	}
};
