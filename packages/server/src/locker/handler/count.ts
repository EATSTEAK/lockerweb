import type { APIGatewayProxyHandler } from 'aws-lambda';
import { queryLockers } from '../data';
import { createResponse } from '../../common';
import { getLockerDepartment } from '../../util/locker';
import { getConfig } from '../../config/data';
import { responseAsLockerError } from '../../util/error';

export const getClaimedLockerCountHandler: APIGatewayProxyHandler = async () => {
	try {
		const config = (await getConfig('SERVICE')) as ServiceConfig;
		const lockers = await queryLockers();
		const result = lockers.reduce<LockerCountResponse>((acc, cur) => {
			const dept = getLockerDepartment(config, cur.lockerId);
			const [buildingId, lockerFloor] = cur.lockerId.split('-');
			if (!acc[dept]) acc[dept] = {};
			if (!acc[dept][buildingId]) acc[buildingId] = {};
			if (typeof acc[dept][buildingId][lockerFloor] !== 'number')
				acc[dept][buildingId][lockerFloor] = 0;
			acc[getLockerDepartment(config, cur.lockerId)][buildingId][lockerFloor] += 1;
			return acc;
		}, {});
		return createResponse(200, {
			success: true,
			result
		});
	} catch (e) {
		return responseAsLockerError(e);
	}
};
