import type {
	ExpressionAttributeValueMap,
	QueryInput,
	QueryOutput,
	UpdateItemInput,
	UpdateItemOutput
} from 'aws-sdk/clients/dynamodb';
import { adminId, dynamoDB, TableName } from '../util/database';
import { BlockedError, CantClaimError, CantUnclaimError, NotFoundError } from '../util/error';
import type { AWSError } from 'aws-sdk';

export const claimLocker = async function (
	id: string,
	token: string,
	blockedDepartments: Array<string>,
	lockerId: string,
	claimedUntil?: number
): Promise<ClaimLockerResponse> {
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
	const conditionValues: ExpressionAttributeValueMap = Object.fromEntries(
		blockedDepartments.map((d) => [`:${d}`, { S: d }])
	);
	conditionValues[':true'] = { BOOL: true };
	const condition = blockedDepartments.map((d) => `NOT d = :${d}`).join(' AND ');
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: id } },
		UpdateExpression: 'SET #lockerId = :lockerId, cU = :claimedUntil',
		ConditionExpression: `#aT = :token${condition ? ` AND ((${condition}) OR iA = :true)` : ''}`,
		ExpressionAttributeNames: {
			'#lockerId': 'lockerId',
			'#aT': 'aT'
		},
		ExpressionAttributeValues: {
			':lockerId': { S: lockerId },
			':token': { S: token },
			':claimedUntil': { N: `${claimedUntil}` },
			...(id !== adminId && condition && conditionValues)
		},
		ReturnValues: 'ALL_NEW'
	};
	let res: UpdateItemOutput;
	try {
		res = await dynamoDB.updateItem(req).promise();
	} catch (e) {
		if ((e as AWSError).name === 'ConditionalCheckFailedException') {
			throw new BlockedError();
		}
		throw e;
	}
	if (res.Attributes.hasOwnProperty('lockerId') && res.Attributes.lockerId?.S === lockerId) {
		return {
			id,
			lockerId,
			claimedUntil: new Date(claimedUntil).toISOString()
		};
	} else {
		throw new CantClaimError("Can't claim requested locker", { id, lockerId, claimedUntil });
	}
};

export const unclaimLocker = async function (
	id: string,
	token: string,
	blockedDepartments: Array<string>
): Promise<UnclaimLockerResponse> {
	const conditionValues: ExpressionAttributeValueMap = Object.fromEntries(
		blockedDepartments.map((d) => [`:${d}`, { S: d }])
	);
	conditionValues[':true'] = { BOOL: true };
	const condition = blockedDepartments.map((d) => `NOT d = :${d}`).join(' AND ');
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: id } },
		UpdateExpression: 'REMOVE #lockerId',
		ConditionExpression: `#aT = :token ${condition ? ` AND ((${condition}) OR iA = :true)` : ''}`,
		ExpressionAttributeNames: {
			'#lockerId': 'lockerId',
			'#aT': 'aT'
		},
		ExpressionAttributeValues: {
			':token': { S: token },
			...(id !== adminId && condition && conditionValues)
		},
		ReturnValues: 'UPDATED_OLD'
	};
	let res: UpdateItemOutput;
	try {
		res = await dynamoDB.updateItem(req).promise();
	} catch (e) {
		if ((e as AWSError).name === 'ConditionalCheckFailedException') {
			throw new BlockedError();
		}
		throw e;
	}
	if (res.Attributes.hasOwnProperty('lockerId')) {
		return {
			id: id,
			lockerId: res.Attributes.lockerId.S
		};
	} else {
		throw new CantUnclaimError('This user is not claimed an locker yet', { id });
	}
};

export const queryLockers = async function (
	starts = '',
	showId?: boolean
): Promise<Array<ReservedLocker>> {
	const req: QueryInput = {
		TableName,
		IndexName: 'lockerIdIndex',
		KeyConditionExpression: `#type = :type${starts ? ' AND begins_with(#id, :starts)' : ''}`,
		FilterExpression: 'attribute_not_exists(cU) OR cU < :zero OR cU > :claimedUntil',
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
	let res: QueryOutput;
	try {
		res = await dynamoDB.query(req).promise();
	} catch (e) {
		if ((e as AWSError).name === 'ConditionalCheckFailedException') {
			throw new NotFoundError('Cannot find lockers');
		}
		throw e;
	}
	return res.Items.map((item) => {
		const ret: ReservedLocker = {
			lockerId: item.lockerId?.S,
			...(item.cu?.N &&
				parseInt(item.cu?.N) >= 0 && { claimedUntil: new Date(parseInt(item.cU?.N)) })
		};
		if (showId) ret.id = item.id.S;
		return ret;
	});
};
