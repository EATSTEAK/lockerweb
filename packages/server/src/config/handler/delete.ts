import type { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../common';
import { assertAccessible } from '../../auth/data';
import { deleteConfig } from '../data';
import { BadRequestError, errorResponse, responseAsLockerError } from '../../util/error';
import { verifyPayload } from '../../util/access';

export const deleteConfigHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  let data: UserDeleteRequest;
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
    if (data.id.toUpperCase() === 'SERVICE')
      return errorResponse(new BadRequestError("Can't delete SERVICE config."));
    const res = await deleteConfig(data.id);
    return createResponse(200, { success: true, result: res });
  } catch (e) {
    return responseAsLockerError(e);
  }
};
