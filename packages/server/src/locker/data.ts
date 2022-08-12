import type { QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { dynamoDB, TableName } from '../util/database';
import { CantClaimError, UnauthorizedError } from '../util/error';

export const revokeLocker = async function(
	id: string,
	token: string
): Promise<{ id: string; lockerFloor?: string; lockerId?: string }> {
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: id } },
		UpdateExpression: 'REMOVE lockerId',
		ConditionExpression: 'aT = :token',
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
	lockerId: string,
	claimedUntil?: number
): Promise<{ id: string; lockerId: string; claimedUntil: number }> {
	if (!claimedUntil) claimedUntil = -1;
	const checkReq: QueryInput = {
		TableName,
		IndexName: 'lockerIdIndex',
		KeyConditionExpression: 'lockerId = :lockerId',
		FilterExpression: 'cU < :zero OR cU > :claimedUntil',
		ExpressionAttributeValues: {
			':zero': { N: '0' },
			':claimedUntil': { N: `${Date.now()}` },
			':lockerId': { S: lockerId }
		}
	};
	const checkRes = await dynamoDB.query(checkReq).promise();
	if (checkRes.Count > 0) throw new CantClaimError('Requested locker is already claimed');
	const req: UpdateItemInput = {
		TableName,
		Key: { id: { S: id } },
		UpdateExpression:
			'SET lockerId = :lockerId, cU = :claimedUntil',
		ConditionExpression: 'aT = :token',
		ExpressionAttributeValues: {
			':lockerId': { S: lockerId },
			':token': { S: token },
			':claimedUntil': { N: `${claimedUntil}` }
		},
		ReturnValues: 'ALL_NEW'
	};
	const res = await dynamoDB.updateItem(req).promise();
	console.debug(res);
	if (
		res.Attributes.hasOwnProperty('lockerId') &&
		res.Attributes.lockerId?.S === lockerId
	) {
		return {
			id,
			claimedUntil,
			lockerId
		};
	} else {
		if (res.Attributes?.accessToken?.S !== token) {
			throw new UnauthorizedError('Unauthorized', { id, lockerId, claimedUntil });
		}
		throw new CantClaimError('Can\'t claim requested locker', { id, lockerId, claimedUntil });
	}
};

export const queryLockers = async function(
	starts = '',
	showId?: boolean
): Promise<Array<{ lockerId: string; claimedUntil: number; id?: string }>> {
	const req: QueryInput = {
		TableName,
		IndexName: 'lockerIdIndex',
		KeyConditionExpression: 'type = :type AND begins_with(id, :starts)',
		FilterExpression: 'cU < :zero OR cU > :claimedUntil',
		ExpressionAttributeValues: {
			':starts': { S: starts },
			':zero': { N: '0' },
			':claimedUntil': { N: `${Date.now()}` },
			':type': { S: 'user' }
		},
		ProjectionExpression: `lockerId, claimedUntil${showId ? ', id' : ''}`
	};
	const res = await dynamoDB.query(req).promise();
	return res.Items.map((item) => {
		const ret: { lockerId: string; claimedUntil: number; id?: string } = {
			lockerId: item.lockerId?.S,
			claimedUntil: parseInt(item.cU?.N)
		};
		if (showId) ret.id = item.id.S;
		return ret;
	});
};