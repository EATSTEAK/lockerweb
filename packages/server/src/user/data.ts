/* USER CRUD */

import type {
  BatchWriteItemInput,
  DeleteItemInput,
  ExpressionAttributeValueMap,
  GetItemInput,
  GetItemOutput,
  QueryInput,
  QueryOutput,
  UpdateItemInput,
  WriteRequest,
} from 'aws-sdk/clients/dynamodb';
import { dynamoDB, TableName } from '../util/database';
import { InternalError, NotFoundError } from '../util/error';
import type { AWSError } from 'aws-sdk';

export const fromUserDao = (dao: UserDao): User => ({
  id: dao.id.S,
  name: dao.n?.S,
  isAdmin: dao.iA?.BOOL ?? false,
  department: dao.d?.S,
  ...(dao.lockerId?.S && { lockerId: dao.lockerId?.S }),
  ...(dao.cU?.N &&
    parseInt(dao.cU?.N ?? '-1') >= 0 && {
      claimedUntil: new Date(parseInt(dao.cU?.N)),
    }),
});

export const toUserDao = (user: User): UserDao => ({
  type: { S: 'user' },
  id: { S: `${user.id}` },
  n: { S: user.name },
  iA: { BOOL: user.isAdmin },
  d: { S: user.department },
  ...(user.lockerId && { lockerId: { S: user.lockerId } }),
  ...(user.claimedUntil && { cU: { N: `${user.claimedUntil.getTime()}` } }),
});

export function toUserResponse(user: User): UserResponse {
  return {
    ...user,
    ...(user.claimedUntil && { claimedUntil: user.claimedUntil.toISOString() }),
  };
}

export const getUser = async function (id: string): Promise<User> {
  const req: GetItemInput = {
    TableName,
    Key: {
      type: { S: 'user' },
      id: { S: `${id}` },
    },
  };
  let res: GetItemOutput;
  try {
    res = await dynamoDB.getItem(req).promise();
  } catch (e) {
    if ((e as AWSError).name === 'ConditionalCheckFailedException') {
      throw new NotFoundError(`Cannot find user info of id ${id}`);
    }
    throw e;
  }
  if (!res.Item) {
    throw new NotFoundError(`Cannot find user info of id ${id}`);
  }
  const dao: UserDao = res.Item as unknown as UserDao;
  return fromUserDao(dao);
};
export const queryUser = async function (startsWith: string): Promise<Array<User>> {
  let composedRes: Array<User> = [];
  const req: QueryInput = {
    TableName,
    KeyConditionExpression: `#type = :v1${startsWith ? ' AND begins_with(#id, :v2)' : ''}`,
    ExpressionAttributeNames: {
      '#type': 'type',
      ...(startsWith && { '#id': 'id' }),
    },
    ExpressionAttributeValues: {
      ':v1': { S: 'user' },
      ...(startsWith && { ':v2': { S: `${startsWith}` } }),
    },
    ProjectionExpression: 'id, n, iA, d, lockerId, cU',
  };
  let res: QueryOutput;
  do {
    try {
      res = await dynamoDB
        .query({
          ...req,
          ...(res &&
            res.LastEvaluatedKey && {
              ExclusiveStartKey: res.LastEvaluatedKey,
            }),
        })
        .promise();
    } catch (e) {
      if ((e as AWSError).name === 'ConditionalCheckFailedException') {
        throw new NotFoundError('Cannot find user info');
      }
      throw e;
    }
    composedRes = [
      ...composedRes,
      ...res.Items.map<User>((v) => fromUserDao(v as unknown as UserDao)),
    ];
  } while (res.LastEvaluatedKey);
  return composedRes;
};

export const updateUser = async function (info: UserUpdateRequest): Promise<UserUpdateRequest> {
  const attributes: ExpressionAttributeValueMap = {};
  let updateExp = '';
  let removeExp = '';
  if (info.name) {
    attributes[':name'] = { S: info.name };
    updateExp = 'SET n = :name';
  }
  if (info.isAdmin !== undefined) {
    attributes[':isAdmin'] = { BOOL: info.isAdmin };
    updateExp += `${updateExp ? ',' : 'SET'} iA = :isAdmin`;
  }
  if (info.department) {
    attributes[':department'] = { S: info.department };
    updateExp += `${updateExp ? ',' : 'SET'} d = :department`;
  }
  if (info.lockerId) {
    attributes[':lockerId'] = { S: info.lockerId };
    updateExp += `${updateExp ? ',' : 'SET'} lockerId = :lockerId`;
  }
  if (info.claimedUntil) {
    attributes[':claimedUntil'] = { N: `${info.claimedUntil}` };
    updateExp += `${updateExp ? ',' : 'SET'} cU = :claimedUntil`;
  }
  if (info.lockerId === null) {
    removeExp += `${removeExp ? ',' : 'REMOVE'} lockerId`;
  }
  if (info.claimedUntil === null) {
    removeExp += `${removeExp ? ',' : 'REMOVE'} cU`;
  }
  const req: UpdateItemInput = {
    TableName,
    Key: {
      type: { S: 'user' },
      id: { S: `${info.id}` },
    },
    UpdateExpression: updateExp + `${removeExp ? ' ' + removeExp : ''}`,
    ...(Object.keys(attributes).length && {
      ExpressionAttributeValues: attributes,
    }),
  };
  await dynamoDB.updateItem(req).promise();
  return info;
};

export const deleteUser = async function (id: string): Promise<string> {
  const req: DeleteItemInput = {
    TableName,
    Key: {
      type: { S: 'user' },
      id: { S: id },
    },
  };
  await dynamoDB.deleteItem(req).promise();
  return id;
};
export const batchPutUser = async function (infos: Array<User>): Promise<Array<User>> {
  if (infos.length === 0) return infos;
  if (infos.length > 25) throw new InternalError('Maximum amount of batch creation is 25');
  const requests: WriteRequest[] = infos.map((v: User) => ({
    PutRequest: {
      Item: {
        ...toUserDao(v),
      },
    },
  }));
  const req: BatchWriteItemInput = {
    RequestItems: {},
  };
  req.RequestItems[TableName] = requests;
  await dynamoDB.batchWriteItem(req).promise();
  return infos;
};

export const batchDeleteUser = async function (ids: Array<string>): Promise<Array<string>> {
  if (ids.length === 0) return ids;
  if (ids.length > 25) throw new InternalError('Maximum amount of batch creation is 25');
  const requests: WriteRequest[] = ids.map((v: string) => ({
    DeleteRequest: {
      Key: {
        type: {
          S: 'user',
        },
        id: {
          S: `${v}`,
        },
      },
    },
  }));
  const req: BatchWriteItemInput = {
    RequestItems: {},
  };
  req.RequestItems[TableName] = requests;
  await dynamoDB.batchWriteItem(req).promise();
  return ids;
};
