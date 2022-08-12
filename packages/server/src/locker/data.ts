import type { QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { dynamoDB, TableName } from '../util/database';
import { CantClaimError, UnauthorizedError } from '../util/error';

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
		KeyConditionExpression: '#type = :type AND #lockerId = :lockerId',
		FilterExpression: 'cU < :zero OR cU > :claimedUntil',
		ExpressionAttributeNames: {
			'#type': 'type',
			'#lockerId': 'lockerId'
		},
		ExpressionAttributeValues: {
			':type': { S: 'user' },
			':zero': { N: '0' },
			':claimedUntil': { N: `${Date.now()}` },
			':lockerId': { S: lockerId }
		}
	};
	const checkRes = await dynamoDB.query(checkReq).promise();
	if (checkRes.Count > 0) throw new CantClaimError('Requested locker is already claimed');
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: id } },
		UpdateExpression:
			'SET #lockerId = :lockerId, cU = :claimedUntil',
		ConditionExpression: '#aT = :token',
		ExpressionAttributeNames: {
			'#lockerId': 'lockerId',
			'#aT': 'aT'
		},
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

export const unclaimLocker = async function(
	id: string,
	token: string
): Promise<{ id: string; lockerId: string }> {
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: id } },
		UpdateExpression:
			'REMOVE #lockerId',
		ConditionExpression: '#aT = :token AND attribute_exists(#lockerId)',
		ExpressionAttributeNames: {
			'#lockerId': 'lockerId',
			'#aT': 'aT'
		},
		ExpressionAttributeValues: {
			':token': { S: token }
		},
		ReturnValues: 'UPDATED_OLD'
	};
	const res = await dynamoDB.updateItem(req).promise();
	console.debug(res);
	if (
		res.Attributes.hasOwnProperty('lockerId')
	) {
		return {
			id: id,
			lockerId: res.Attributes.lockerId.S
		};
	} else {
		if (res.Attributes?.accessToken?.S !== token) {
			throw new UnauthorizedError('Unauthorized', { id });
		}
		throw new CantClaimError('This user is not claimed an locker yet', { id });
	}
};

export const queryLockers = async function(
	starts = '',
	showId?: boolean
): Promise<Array<{ lockerId: string; claimedUntil: number; id?: string }>> {
	const req: QueryInput = {
		TableName,
		IndexName: 'lockerIdIndex',
		KeyConditionExpression: `#type = :type${starts ? ' AND begins_with(#id, :starts)' : ''}`,
		FilterExpression: 'cU < :zero OR cU > :claimedUntil',
		ExpressionAttributeNames: {
			'#type': 'type',
			...(starts && { '#id': 'id' })
		},
		ExpressionAttributeValues: {
			...(starts && { ':starts': { S: starts } }),
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