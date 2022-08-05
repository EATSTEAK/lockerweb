import type { GetItemInput, QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { dynamoDB, TableName } from '../util/database';
import { NotFoundError } from '../util/error';


function toServiceConfigDao(data: ServiceConfig): ServiceConfigDao {
	return undefined;
}

function fromServiceConfigDao(dao: ServiceConfigDao): ServiceConfig {
	return undefined;
}

function toDepartmentConfigDao(dao: DepartmentConfigDao): DepartmentConfig {
	return undefined;
}

function fromDepartmentConfigDao(dao: DepartmentConfigDao): DepartmentConfig {
	return undefined;
}

export const queryConfig = async function(startsWith: string): Promise<Array<Config>> {
	let composedRes: Array<Config> = [];
	const req: QueryInput = {
		TableName,
		KeyConditionExpression: '#type = :v1 AND begins_with(#id, :v2)',
		ExpressionAttributeNames: {
			'#type': 'type',
			'#id': 'id'
		},
		ExpressionAttributeValues: {
			':v1': { S: 'config' },
			':v2': { S: `${startsWith}` }
		}
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
			...res.Items.map<Config>((v) => v.id.S === 'SERVICE' ? fromServiceConfigDao(v as unknown as ServiceConfigDao) : fromDepartmentConfigDao(v as unknown as DepartmentConfigDao))
		];
	} while (res.LastEvaluatedKey);
	return composedRes;
};

export const getConfig = async function(id: string): Promise<Config> {
	const req: GetItemInput = {
		TableName,
		Key: {
			type: { S: 'config' },
			id: { S: `${id}` }
		}
	};
	const res = await dynamoDB.getItem(req).promise();
	if (res.Item === undefined) {
		throw new NotFoundError(`Cannot find config of id ${id}`);
	}
	const dao: ConfigDao = res.Item as unknown as ConfigDao;
	return dao.id.S === 'SERVICE' ? fromServiceConfigDao(dao as ServiceConfigDao) : fromDepartmentConfigDao(dao as DepartmentConfigDao);
};