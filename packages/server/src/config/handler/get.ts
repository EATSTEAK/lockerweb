import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { queryConfig } from '../data';
import { responseAsResponsibleError } from '../../util/error';

export const getConfigHandler: APIGatewayProxyHandler = async (event) => {
	try {
		const configs = await queryConfig();
		return createResponse(200, {
			success: true,
			result: configs
		});
	} catch (e) {
		responseAsResponsibleError(e);
	}
};
