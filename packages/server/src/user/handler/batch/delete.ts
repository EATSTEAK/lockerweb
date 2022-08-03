import type { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../env";
import type { JwtPayload } from "jsonwebtoken";
import { getUserInfo } from "../../data";
import { createResponse } from "../../../common";

export const batchDeleteUserHandler: APIGatewayProxyHandler = async (event) => {
  const token = (event.headers.Authorization ?? '').replace('Bearer ', '');
  const id = (jwt.verify(token, JWT_SECRET) as JwtPayload).aud as string;
  return createResponse(200, {
    success: true
  });
};