import type { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import type { JwtPayload } from "jsonwebtoken";
import { createResponse } from "../../common";
import { getUserInfo } from "../data";

export const getUserInfoHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  const id = (jwt.verify(token, JWT_SECRET) as JwtPayload).aud as string;
  const res = await getUserInfo(id);
  if (res.lockerId) {
    return createResponse(200, {
      success: true,
      result: { ...res, claimed: true }
    });
  }
  return createResponse(200, {
    success: true,
    result: {
      ...res,
      claimed: false
    }
  });
};