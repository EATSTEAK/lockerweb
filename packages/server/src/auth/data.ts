import type { UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { adminId, dynamoDB, TableName } from "../common";
import { UnauthorizedError } from "../error";

export const revokeToken = async function(
  id: string,
  token: string
): Promise<{ accessToken: string }> {
  const req: UpdateItemInput = {
    TableName,
    Key: { id: { S: id } },
    UpdateExpression: 'REMOVE accessToken',
    ConditionExpression: 'accessToken = :token',
    ExpressionAttributeValues: {
      ':token': { S: token }
    },
    ReturnValues: 'UPDATED_OLD'
  };
  const res = await dynamoDB.updateItem(req).promise();
  if (res.Attributes.hasOwnProperty('accessToken')) {
    return { accessToken: token };
  } else {
    throw new UnauthorizedError();
  }
};

export const issueToken = async function(
  id: string,
  token: string
): Promise<{ id: string; expires: number }> {
  const expires = Date.now() + 3600 * 1000;
  const req: UpdateItemInput = {
    TableName,
    Key: { id: { S: id } },
    UpdateExpression: 'SET accessToken = :token, expiresOn = :expiresOn',
    ExpressionAttributeValues: {
      ':token': { S: token },
      ':expiresOn': { N: `${expires}` }
    },
    ReturnValues: 'UPDATED_NEW'
  };
  if (id !== adminId) {
    req.ConditionExpression = 'attribute_exists(is_admin) OR attribute_exists(department)';
  }
  const res = await dynamoDB.updateItem(req).promise();
  if (res.Attributes.hasOwnProperty('accessToken')) {
    return { id, expires };
  } else {
    throw new UnauthorizedError('Unauthorized', { id, expires });
  }
};