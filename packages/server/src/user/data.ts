/* USER CRUD */

import type {
	BatchWriteItemInput,
	DeleteItemInput,
	ExpressionAttributeValueMap,
	GetItemInput,
	QueryInput,
	QueryOutput,
	UpdateItemInput,
	WriteRequest
} from 'aws-sdk/clients/dynamodb';
import { dynamoDB, TableName } from '../util/database';
import { NotFoundError, ResponsibleError } from '../util/error';

export const fromUserDao = (dao: UserDao): User => ({
	id: dao.id.S,
	name: dao.n?.S,
	isAdmin: dao.iA?.BOOL ?? false,
	department: dao.d?.S,
	...(dao.lockerId?.S && { lockerId: dao.lockerId?.S }),
	...(dao.cU?.S && { lockerId: dao.cU?.S })
});
export const toUserDao = (user: User): UserDao => ({
	type: { S: 'user' },
	id: { S: `${user.id}` },
	n: { S: user.name },
	iA: { BOOL: user.isAdmin },
	d: { S: user.department },
	...(user.lockerId && { lockerId: { S: user.lockerId } }),
	...(user.claimedUntil && { cU: { S: user.claimedUntil } })
});

export const getUser = async function(id: string): Promise<User> {
	const req: GetItemInput = {
		TableName,
		Key: {
			type: { S: 'user' },
			id: { S: `${id}` }
		}
	};
	const res = await dynamoDB.getItem(req).promise();
	if (res.Item === undefined) {
		throw new NotFoundError(`Cannot find user info of id ${id}`);
	}
	const dao: UserDao = res.Item as unknown as UserDao;
	return fromUserDao(dao);
};
export const queryUser = async function(startsWith: string): Promise<Array<User>> {
	let composedRes: Array<User> = [];
	const req: QueryInput = {
		TableName,
		KeyConditionExpression: `#type = :v1${startsWith ? ' AND begins_with(#id, :v2)' : ''}`,
		ExpressionAttributeNames: {
			'#type': 'type',
			...(startsWith && { '#id': 'id' })
		},
		ExpressionAttributeValues: {
			':v1': { S: 'user' },
			...(startsWith && { ':v2': { S: `${startsWith}` } })
		},
		ProjectionExpression: 'id, n, iA, d, lockerId, cU'
	};
	let res: QueryOutput;
	do {
		res = await dynamoDB
			.query({
				...req,
				...(res && res.LastEvaluatedKey && { ExclusiveStartKey: res.LastEvaluatedKey })
			})
			.promise();
		composedRes = [
			...composedRes,
			...res.Items.map<User>((v) => fromUserDao(v as unknown as UserDao))
		];
	} while (res.LastEvaluatedKey);
	return composedRes;
};

export const updateUser = async function(info: UserUpdateRequest): Promise<UserUpdateRequest> {
	const attributes: ExpressionAttributeValueMap = {};
	let updateExp = '';
	if (info.name) {
		attributes[':name'] = { S: info.name };
		updateExp = 'SET n = :name';
	}
	if (info.isAdmin) {
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
		attributes[':claimedUntil'] = { S: info.claimedUntil };
		updateExp += `${updateExp ? ',' : 'SET'} cU = :claimedUntil`;
	}
	const req: UpdateItemInput = {
		TableName,
		Key: {
			type: { S: 'user' },
			id: { S: `${info.id}` }
		},
		UpdateExpression: updateExp,
		ExpressionAttributeValues: attributes
	};
	await dynamoDB.updateItem(req).promise();
	return info;
};

export const deleteUser = async function(id: string): Promise<string> {
	const req: DeleteItemInput = {
		TableName,
		Key: {
			type: { S: 'user' },
			id: { S: id }
		}
	};
	await dynamoDB.deleteItem(req).promise();
	return id;
};
export const batchPutUser = async function(infos: Array<User>): Promise<Array<User>> {
	if (infos.length === 0) return infos;
	if (infos.length > 25) throw new ResponsibleError('Maximum amount of batch creation is 25');
	const requests: WriteRequest[] = infos.map((v: User) => ({
		PutRequest: {
			Item: {
				...toUserDao(v)
			}
		}
	}));
	const req: BatchWriteItemInput = {
		RequestItems: {}
	};
	req.RequestItems[TableName] = requests;
	const res = await dynamoDB.batchWriteItem(req).promise();
	console.log(res);
	return infos;
};

export const batchDeleteUser = async function(ids: Array<string>): Promise<Array<string>> {
	if (ids.length === 0) return ids;
	if (ids.length > 25) throw new ResponsibleError('Maximum amount of batch creation is 25');
	const requests: WriteRequest[] = ids.map((v: string) => ({
		DeleteRequest: {
			Key: {
				type: {
					S: 'user'
				},
				id: {
					S: `${v}`
				}
			}
		}
	}));
	const req: BatchWriteItemInput = {
		RequestItems: {}
	};
	req.RequestItems[TableName] = requests;
	const res = await dynamoDB.batchWriteItem(req).promise();
	console.log(res);
	return ids;
};