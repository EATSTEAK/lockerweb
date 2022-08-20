import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { claimLocker } from '../data';
import { getUser } from '../../user/data';
import { isValidLocker } from '../../util/locker';
import { queryConfig } from '../../config/data';
import { errorResponse, isResponsibleError, ResponsibleError } from '../../util/error';
import { adminId } from '../../util/database';

export const claimLockerHandler: APIGatewayProxyHandler = async (event) => {
	const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
	let data: {
		lockerId: string;
		until?: number;
	};
	try {
		data = JSON.parse(event.body) as { lockerId: string; until?: number };
	} catch {
		return createResponse(500, {
			success: false,
			error: 500,
			errorDescription: 'Data body is malformed JSON'
		});
	}
	let payload: JwtPayload;
	if (!data.lockerId) {
		return createResponse(500, {
			success: false,
			error: 500,
			errorDescription: 'Key "locker_id" is must be given'
		});
	}

	try {
		payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const id = payload.aud as string;
		const user = await getUser(id);
		const config = await queryConfig();
		const blockedDepartments = config
			.filter((c) => {
				const activateFrom = new Date(c.activateFrom);
				const activateTo = new Date(c.activateTo);
				return (
					c.activateFrom &&
					activateFrom.getTime() >= Date.now() &&
					c.activateTo &&
					activateTo.getTime() <= Date.now()
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
		if (
			!isValidLocker(
				config.find((v) => v.id === 'SERVICE') as ServiceConfig,
				data.lockerId,
				user.department
			)
		) {
			return createResponse(500, {
				success: false,
				error: 500,
				errorDescription: 'Unknown locker data'
			});
		}
		if (data.until !== undefined && typeof data.until !== 'number') {
			return createResponse(500, {
				success: false,
				error: 500,
				errorDescription: 'Key "until" is must be number'
			});
		}
		const lockerId = data.lockerId;
		const until = data?.until;
		const res = until
			? await claimLocker(id, token, blockedDepartments, lockerId, until)
			: await claimLocker(id, token, blockedDepartments, lockerId);
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
