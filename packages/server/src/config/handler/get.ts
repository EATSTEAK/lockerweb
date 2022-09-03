import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { queryConfig } from '../data';
import { responseAsLockerError } from '../../util/error';

export const getConfigHandler: APIGatewayProxyHandler = async () => {
	try {
		const configs = await queryConfig();
		return createResponse(200, {
			success: true,
			result: configs
		});
	} catch (e) {
		responseAsLockerError(e);
	}
};
