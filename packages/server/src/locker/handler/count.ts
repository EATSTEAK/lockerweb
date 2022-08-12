import type { APIGatewayProxyHandler } from 'aws-lambda';
import { queryLockers } from '../data';
import { createResponse } from '../../common';
import { getLockerDepartment } from '../../util/locker';
import { getConfig } from '../../config/data';

export const getClaimedLockerCountHandler: APIGatewayProxyHandler = async () => {
	const config = await getConfig('SERVICE') as ServiceConfig;
	const lockers = await queryLockers();
	const result = lockers.reduce<{ E: number; A: number; C: number; S: number; G: number }>(
		(acc, cur) => {
			acc[getLockerDepartment(config, cur.lockerId)] += 1;
			return acc;
		},
		{ E: 0, A: 0, C: 0, S: 0, G: 0 }
	);
	return createResponse(200, {
		success: true,
		result
	});
};