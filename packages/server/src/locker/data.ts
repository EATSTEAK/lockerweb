import type { QueryInput, ScanInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { assertAdmin, dynamoDB, TableName } from "../common";
import { CantClaimError, UnauthorizedError } from "../error";

export const revokeLocker = async function(
  id: string,
  token: string
): Promise<{ id: string; lockerFloor?: string; lockerId?: string }> {
  const req: UpdateItemInput = {
    TableName,
    Key: { id: { S: id } },
    UpdateExpression: 'REMOVE lockerFloor, lockerId',
    ConditionExpression: 'accessToken = :token',
    ExpressionAttributeValues: {
      ':token': { S: token }
    },
    ReturnValues: 'ALL_OLD'
  };
  const res = await dynamoDB.updateItem(req).promise();
  if (res.Attributes.accessToken?.S !== token) {
    throw new UnauthorizedError('Unauthorized');
  }
  if (res.Attributes.lockerId?.S) return { id, lockerId: res.Attributes.lockerId.S };
  return { id };
};

export const claimLocker = async function(
  id: string,
  token: string,
  lockerFloor: string,
  lockerId: string,
  claimedUntil?: number
): Promise<{ id: string; lockerFloor: string; lockerId: string; claimedUntil: number }> {
  if (!claimedUntil) claimedUntil = -1;
  const checkReq: QueryInput = {
    TableName,
    IndexName: 'lockerIdIndex',
    KeyConditionExpression: 'lockerFloor = :lockerFloor AND lockerId = :lockerId',
    FilterExpression: 'claimedUntil < :zero OR claimedUntil > :claimedUntil',
    ExpressionAttributeValues: {
      ':zero': { N: '0' },
      ':claimedUntil': { N: `${Date.now()}` },
      ':lockerFloor': { S: lockerFloor },
      ':lockerId': { S: lockerId }
    }
  };
  const checkRes = await dynamoDB.query(checkReq).promise();
  if (checkRes.Count > 0) throw new CantClaimError('Requested locker is already claimed');
  const req: UpdateItemInput = {
    TableName,
    Key: { id: { S: id } },
    UpdateExpression:
      'SET lockerFloor = :lockerFloor, lockerId = :lockerId, claimedUntil = :claimedUntil',
    ConditionExpression: 'accessToken = :token',
    ExpressionAttributeValues: {
      ':lockerFloor': { S: lockerFloor },
      ':lockerId': { S: lockerId },
      ':token': { S: token },
      ':claimedUntil': { N: `${claimedUntil}` }
    },
    ReturnValues: 'ALL_NEW'
  };
  const res = await dynamoDB.updateItem(req).promise();
  console.debug(res);
  if (
    res.Attributes.hasOwnProperty('lockerFloor') &&
    res.Attributes.lockerFloor?.S === lockerFloor &&
    res.Attributes.hasOwnProperty('lockerId') &&
    res.Attributes.lockerId?.S === lockerId
  ) {
    return {
      id,
      claimedUntil,
      lockerFloor,
      lockerId
    };
  } else {
    if (res.Attributes?.accessToken?.S !== token) {
      throw new UnauthorizedError('Unauthorized', { id, lockerId, claimedUntil });
    }
    throw new CantClaimError('Can\'t claim requested locker', { id, lockerId, claimedUntil });
  }
};

export const getClaimedLockers = async () => {
  const req: ScanInput = {
    TableName,
    IndexName: 'lockerIdIndex'
  };
  const res = await dynamoDB.scan(req).promise();
  return res.Items.map((value) => ({
    lockerFloor: value.lockerFloor.S,
    lockerId: value.lockerId.S
  }));
};

export const queryLockers = async function(
  department: string,
  showId?: boolean,
  modId?: string,
  token?: string
): Promise<Array<{ lockerFloor: string; lockerId: string; claimedUntil: number; id?: string }>> {
  if (showId && modId && token) {
    try {
      await assertAdmin(modId, token);
    } catch {
      showId = false;
    }
  }
  const req: QueryInput = {
    TableName,
    IndexName: 'lockerIdIndex',
    KeyConditionExpression: 'department = :department',
    FilterExpression: 'claimedUntil < :zero OR claimedUntil > :claimedUntil',
    ExpressionAttributeValues: {
      ':zero': { N: '0' },
      ':claimedUntil': { N: `${Date.now()}` },
      ':department': { S: department }
    },
    ProjectionExpression: `lockerId, claimedUntil${showId ? ', id' : ''}`
  };
  const res = await dynamoDB.query(req).promise();
  return res.Items.map((item) => {
    const ret: { lockerFloor: string; lockerId: string; claimedUntil: number; id?: string } = {
      lockerFloor: item.lockerFloor?.S,
      lockerId: item.lockerId?.S,
      claimedUntil: parseInt(item.claimedUntil?.N)
    };
    if (showId) ret.id = item.id.S;
    return ret;
  });
};