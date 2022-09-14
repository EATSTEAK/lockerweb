import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { getUser, toUserResponse } from '../data';
import { responseAsLockerError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const getUserHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  try {
    const id = verifyPayload(token).aud as string;
    const result = toUserResponse(await getUser(id));
    return createResponse(200, {
      success: true,
      result,
    });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
