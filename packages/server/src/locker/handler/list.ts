import type { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import type { JwtPayload } from "jsonwebtoken";
import { createResponse } from "../../common";
import { queryLockers } from "../data";

export const getClaimedLockersHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  const floor = event.queryStringParameters?.floor ?? '';
  const showId = event.queryStringParameters?.show_id === 'true';
  let id: string;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    id = payload.aud as string;
  } catch {
    return createResponse(401, {
      success: false,
      error: 401,
      error_description: 'Unauthorized'
    });
  }
  if (!floor) {
    return createResponse(500, {
      success: false,
      error: 500,
      error_description: 'You should query with floor parameter'
    });
  }
  const result = await queryLockers(floor, showId, id, token);
  return createResponse(200, {
    success: true,
    floor: floor,
    result
  });
};