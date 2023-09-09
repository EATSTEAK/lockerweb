import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common.js';
import { assertAccessible } from '../../auth/data.js';
import { updateConfig } from '../data.js';
import { BadRequestError, errorResponse, responseAsLockerError } from '../../util/error.js';
import { verifyPayload } from '../../util/access.js';

export const updateConfigHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  let data: ConfigUpdateRequest;
  try {
    data = JSON.parse(event.body) as UserDeleteRequest;
  } catch {
    return errorResponse(new BadRequestError('Request body is malformed JSON'));
  }
  if (!data || !data.id) {
    return errorResponse(new BadRequestError('Request body does not contains id field'));
  }
  try {
    const payload = verifyPayload(token);
    const id = payload.aud as string;
    await assertAccessible(id, token, true);
    await updateConfig(data);
    return createResponse(200, { success: true });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
