import type { GetItemInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { UnauthorizedError } from '../util/error';
import { adminId, dynamoDB, TableName } from '../util/database';
import { fromUserDao } from '../user/data';

/* ISSUE/REVOKE TOKEN */

export const revokeToken = async function(
	id: string,
	token: string
): Promise<{ accessToken: string }> {
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: `${id}` } },
		UpdateExpression: 'REMOVE aT',
		ConditionExpression: 'aT = :token',
		ExpressionAttributeValues: {
			':token': { S: token }
		},
		ReturnValues: 'UPDATED_OLD'
	};
	const res = await dynamoDB.updateItem(req).promise();
	if (res.Attributes.hasOwnProperty('aT')) {
		return { accessToken: token };
	} else {
		throw new UnauthorizedError();
	}
};

export const issueToken = async function(
	id: string,
	token: string
): Promise<{ id: string; expires: number }> {
	const expires = Date.now() + 3600 * 1000 * 24;
	const req: UpdateItemInput = {
		TableName,
		Key: { type: { S: 'user' }, id: { S: `${id}` } },
		UpdateExpression: 'SET aT = :token, eO = :expiresOn',
		...(id !== adminId && { ConditionExpression: 'attribute_exists(d)' }),
		ExpressionAttributeValues: {
			':token': { S: token },
			':expiresOn': { N: `${expires}` }
		},
		ReturnValues: 'UPDATED_NEW'
	};
	const res = await dynamoDB.updateItem(req).promise();
	if (res.Attributes.hasOwnProperty('aT')) {
		return { id, expires };
	} else {
		throw new UnauthorizedError('Unauthorized', { id, expires });
	}
};

export async function assertAccessible(id: string, token: string, adminOnly = false): Promise<User> {
	const authReq: GetItemInput = {
		TableName,
		Key: {
			module: { S: 'user' },
			dataId: {
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
		throw new UnauthorizedError('Unauthorized');
	}
	return fromUserDao(authRes.Item as unknown as UserDao);
}