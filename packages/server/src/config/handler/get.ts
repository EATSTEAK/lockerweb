import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { queryConfig, toConfigResponse } from '../data';
import { responseAsLockerError } from '../../util/error';

export const getConfigHandler: APIGatewayProxyHandler = async () => {
  try {
    const configs = (await queryConfig()).map(toConfigResponse);
    return createResponse(200, {
      success: true,
      result: configs,
    });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
