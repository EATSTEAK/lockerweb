import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { unclaimLocker } from '../data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';
import { queryConfig } from '../../config/data';
import { adminId } from '../../util/database';

export const unclaimLockerHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let payload: JwtPayload;
	try {
		payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const id = payload.aud as string;
		const config = await queryConfig();
		const blockedDepartments = config
			.filter((c) => {
				const activateFrom = new Date(c.activateFrom);
				const activateTo = new Date(c.activateTo);
				return (
					(c.activateFrom && activateFrom.getTime() > Date.now()) ||
					(c.activateTo && activateTo.getTime() < Date.now())
				);
			})
			.map((c) => c.id);
		if (adminId !== id && blockedDepartments.includes('SERVICE')) {
			return createResponse(403, {
				success: false,
				error: 403,
				errorDescription: 'Forbidden'
			});
		}
		const res = await unclaimLocker(id, token, blockedDepartments);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		if (!isResponsibleError(e)) {
			console.error(e);
			const res = {
				success: false,
				error: 500,
				errorDescription: 'Internal error'
			};
			return createResponse(500, res);
		}
		return errorResponse(e as ResponsibleError);
	}
};
