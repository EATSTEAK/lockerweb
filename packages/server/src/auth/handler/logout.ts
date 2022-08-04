import type { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import type { JwtPayload } from "jsonwebtoken";
import { revokeToken } from "../data";
import { createResponse } from "../../common";

export const logoutHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const res = await revokeToken(payload.aud as string, token);
    return createResponse(200, { success: true, ...res });
  } catch (err) {
    const res = {
      success: false,
      token,
      error: 401,
      error_description: 'Unauthorized'
    };
    return createResponse(401, res);
  }
};