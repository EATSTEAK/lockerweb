import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { unclaimLocker } from '../data';
import { BlockedError, errorResponse, responseAsLockerError } from '../../util/error';
import { queryConfig } from '../../config/data';
import { adminId } from '../../util/database';
import { getBlockedDepartments, verifyPayload } from '../../util/access';

export const unclaimLockerHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	try {
		const payload = verifyPayload(token);
		const id = payload.aud as string;
		const configs = await queryConfig();
		const blockedDepartments = getBlockedDepartments(configs);
		if (adminId !== id && blockedDepartments.includes('SERVICE')) {
			return errorResponse(new BlockedError('Service unavailable'));
		}
		const res = await unclaimLocker(id, token, blockedDepartments);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		return responseAsLockerError(e);
	}
};
