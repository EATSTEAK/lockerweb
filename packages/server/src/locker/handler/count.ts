import type { APIGatewayProxyHandler } from 'aws-lambda';
import { queryLockers } from '../data';
import { createResponse } from '../../common';
import { getLockerDepartment } from '../../util/locker';
import { getConfig } from '../../config/data';

export const getClaimedLockerCountHandler: APIGatewayProxyHandler = async () => {
	const config = (await getConfig('SERVICE')) as ServiceConfig;
	const lockers = await queryLockers();
	const result = lockers.reduce<LockerCountResponse>((acc, cur) => {
		const dept = getLockerDepartment(config, cur.lockerId);
		const parsedLockerId = cur.lockerId.split('-');
		const lockerFloor = parsedLockerId[1];
		if (!acc[dept]) acc[dept] = {};
		if (typeof acc[dept][lockerFloor] !== 'number') acc[dept][lockerFloor] = 0;
		acc[getLockerDepartment(config, cur.lockerId)][lockerFloor] += 1;
		return acc;
	}, {});
	return createResponse(200, {
		success: true,
		result
	});
};
