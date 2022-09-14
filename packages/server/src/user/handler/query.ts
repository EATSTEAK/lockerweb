import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { assertAccessible } from '../../auth/data';
import { queryUser, toUserResponse } from '../data';
import { responseAsLockerError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const queryUserHandler: APIGatewayProxyHandler = async (event) => {
  const startsWith = event.queryStringParameters?.starts ?? '';
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  try {
    const id = verifyPayload(token).aud as string;
    await assertAccessible(id, token, true);
    const result = (await queryUser(startsWith)).map(toUserResponse);
    return createResponse(200, {
      success: true,
      result,
    });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
