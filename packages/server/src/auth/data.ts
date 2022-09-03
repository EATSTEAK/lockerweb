import type {
	ExpressionAttributeValueMap,
	GetItemInput,
	UpdateItemInput,
	UpdateItemOutput
} from 'aws-sdk/clients/dynamodb';
import { ForbiddenError, UnauthorizedError } from '../util/error';
import { adminId, dynamoDB, TableName } from '../util/database';
import type { AWSError } from 'aws-sdk';

/* ISSUE/REVOKE TOKEN */

export const revokeToken = async function (
	id: string,
	token: string
): Promise<{ accessToken: string }> {
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: `${id}` } },
		UpdateExpression: 'REMOVE #aT',
		ConditionExpression: '#aT = :token',
		ExpressionAttributeNames: {
			'#aT': 'aT'
		},
		ExpressionAttributeValues: {
			':token': { S: token }
		},
		ReturnValues: 'UPDATED_OLD'
	};
	let res: UpdateItemOutput;
	try {
		res = await dynamoDB.updateItem(req).promise();
	} catch (e) {
		if ((e as AWSError).name === 'ConditionalCheckFailedException') {
			throw new ForbiddenError('Cannot logout when token is invalid');
		}
		throw e;
	}
	if (res.Attributes.hasOwnProperty('aT')) {
		return { accessToken: token };
	} else {
		throw new UnauthorizedError();
	}
};

export const issueToken = async function (
	id: string,
	token: string,
	blockedDepartments: Array<string>
): Promise<{ id: string; expires: number }> {
	const expires = Date.now() + 3600 * 1000 * 24;
	const conditionValues: ExpressionAttributeValueMap = Object.fromEntries(
		blockedDepartments.map((d) => [`:${d}`, { S: d }])
	);
	conditionValues[':true'] = { BOOL: true };
	const blockDeptCondition = blockedDepartments.map((d) => `(NOT d = :${d})`).join(' AND ');
	const condition = blockDeptCondition
		? `attribute_exists(d) AND ${blockDeptCondition}`
		: 'attribute_exists(d)';
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: `${id}` } },
		UpdateExpression: 'SET #aT = :token, eO = :expiresOn',
		ExpressionAttributeNames: {
			'#aT': 'aT'
		},
		...(id !== adminId && {
			ConditionExpression: `iA = :true OR (${condition})`
		}),
		ExpressionAttributeValues: {
			':token': { S: token },
			':expiresOn': { N: `${expires}` },
			...(id !== adminId && conditionValues)
		},
		ReturnValues: 'ALL_NEW'
	};
	let res: UpdateItemOutput;
	try {
		res = await dynamoDB.updateItem(req).promise();
	} catch (e) {
		if ((e as AWSError).name === 'ConditionalCheckFailedException') {
			throw new ForbiddenError('This user cannot login to service');
		}
		throw e;
	}
	if (res.Attributes.hasOwnProperty('aT') && res.Attributes.aT.S === token) {
		return { id, expires };
	} else {
		throw new ForbiddenError('Cannot issue token', { id, expires });
	}
};

export async function assertAccessible(
	id: string,
	token: string,
	adminOnly = false
): Promise<boolean> {
	const authReq: GetItemInput = {
		TableName,
		Key: {
			type: { S: 'user' },
			id: {
				S: `${id}`
			}
		}
	};
	const authRes = await dynamoDB.getItem(authReq).promise();
	if (
		authRes.Item.id.S !== `${id}` ||
		authRes.Item.aT?.S !== token ||
		(adminOnly && authRes.Item.iA?.BOOL !== true && id !== adminId)
	) {
		throw new UnauthorizedError('Sufficient permission');
	}
	return true;
}
