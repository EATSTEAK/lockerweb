import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common.js';
import { unclaimLocker } from '../data.js';
import { responseAsLockerError } from '../../util/error.js';
import { queryConfig } from '../../config/data.js';
import { getBlockedDepartments, verifyPayload } from '../../util/access.js';

export const unclaimLockerHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  try {
    const payload = verifyPayload(token);
    const id = payload.aud as string;
    const configs = await queryConfig();
    const blockedDepartments = getBlockedDepartments(configs);
    const isServiceBlocked = blockedDepartments.includes('SERVICE');
    const res = await unclaimLocker(
      id,
      token,
      blockedDepartments.filter((configId) => configId !== 'SERVICE'),
      isServiceBlocked,
    );
    return createResponse(200, { success: true, result: res });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
