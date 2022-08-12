import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { claimLocker } from '../data';
import { ResponsibleError } from '../../util/error';
import { getUser } from '../../user/data';
import { isValidLocker } from '../../util/locker';
import { getConfig } from '../../config/data';

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
			error_description: 'Data body is malformed JSON'
		});
	}
	let payload: JwtPayload;
	if (!data.lockerId) {
		return createResponse(500, {
			success: false,
			error: 500,
			error_description: 'Key "locker_id" is must be given'
		});
	}

	try {
		payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const id = payload.aud as string;
		const user = await getUser(id);
		const config = await getConfig('SERVICE') as ServiceConfig;
		if (!isValidLocker(config, data.lockerId, user.department)) {
			return createResponse(500, {
				success: false,
				error: 500,
				error_description: 'Unknown locker data'
			});
		}
		if (data.until !== undefined && typeof data.until !== 'number') {
			return createResponse(500, {
				success: false,
				error: 500,
				error_description: 'Key "until" is must be number'
			});
		}
		const lockerId = data.lockerId;
		const until = data?.until;
		const res = until
			? await claimLocker(id, token, lockerId, until)
			: await claimLocker(id, token, lockerId);
		return createResponse(200, { success: true, result: res });
	} catch (e) {
		if (!(e instanceof ResponsibleError)) {
			console.error(e);
			const res = {
				success: false,
				error: 500,
				error_description: 'Internal error'
			};
			return createResponse(500, res);
		}
		return e.response();
	}
};