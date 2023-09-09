import type { APIGatewayProxyHandler } from 'aws-lambda';
import { queryLockers } from '../data.js';
import { createResponse } from '../../common.js';
import { getLockerDepartment } from '../../util/locker.js';
import { getConfig } from '../../config/data.js';
import { responseAsLockerError } from '../../util/error.js';

export const getClaimedLockerCountHandler: APIGatewayProxyHandler = async () => {
  try {
    const config = (await getConfig('SERVICE')) as ServiceConfig;
    const lockers = await queryLockers();
    const result = lockers.reduce<LockerCountResponse>((acc, cur) => {
      const dept = getLockerDepartment(config, cur.lockerId);
      const [buildingId, lockerFloor] = cur.lockerId.split('-');
      if (typeof acc[dept] !== 'object') acc[dept] = {};
      if (typeof acc[dept][buildingId] !== 'object') acc[dept][buildingId] = {};
      if (typeof acc[dept][buildingId][lockerFloor] !== 'number')
        acc[dept][buildingId][lockerFloor] = 0;
      acc[dept][buildingId][lockerFloor] += 1;
      return acc;
    }, {});
    return createResponse(200, {
      success: true,
      result,
    });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
