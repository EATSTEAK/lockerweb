import type {
	ExpressionAttributeValueMap,
	GetItemInput,
	QueryInput,
	QueryOutput,
	UpdateItemInput
} from "aws-sdk/clients/dynamodb";
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

function toBuildingData(building: Building): BuildingData {
	return undefined;
}

function fromBuildingData(data: BuildingData): Building {
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

export const updateConfig = async function(config: ConfigUpdateRequest) {
	const attributes: ExpressionAttributeValueMap = {};
	let updateExp = '';
	if(config.name) {
		attributes[':name'] = { S: config.name };
		updateExp = 'SET n = :name';
	}
	if(config.activateFrom) {
		attributes[':activateFrom'] = { S: config.activateFrom };
		updateExp = `${updateExp ? ',' : 'SET'} aF = :activateFrom`;
	}
	if(config.activateTo) {
		attributes[':activateTo'] = { S: config.activateTo };
		updateExp = `${updateExp ? ',' : 'SET'} aT = :activateTo`;
	}
	if((config as ServiceConfigUpdateRequest).buildings) {
		const buildings = (config as ServiceConfigUpdateRequest).buildings;
		attributes[':buildings'] = { M: Object.fromEntries(Object.entries(buildings).map(([s, b]) => [s, { M: toBuildingData(b) }])) };
		updateExp = `${updateExp ? ',' : 'SET'} b = :buildings`;
	}
	if((config as DepartmentConfigUpdateRequest).contact) {
		attributes[':contact'] = { S: (config as DepartmentConfigUpdateRequest).contact }
		updateExp = `${updateExp ? ',' : 'SET'} c = :contact`;
	}

	const req: UpdateItemInput = {
		TableName,
		Key: {
			type: { S: 'config' },
			id: { S: config.id }
		},
		UpdateExpression: updateExp,
		ExpressionAttributeValues: attributes
	};
	await dynamoDB.updateItem(req).promise();
	return config;
}