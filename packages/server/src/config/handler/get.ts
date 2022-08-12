import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { queryConfig } from '../data';
import { ResponsibleError } from '../../util/error';

export const getConfigHandler: APIGatewayProxyHandler = async (event) => {
	try {
		const configs = await queryConfig();
		return createResponse(200, {
			success: true,
			result: configs
		});
	} catch (e) {
		if (e instanceof ResponsibleError) {
			return e.response();
		}
		return createResponse(200, {
			success: false,
			error: 500,
			errorDescription: 'Internal error'
		});
	}

};