import { DynamoDBClient, type DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

const awsRegion = process.env.AWS_REGION ?? 'ap-southeast-2';
export const TableName = process.env.TABLE_NAME ?? 'LockerTable';
export const adminId = process.env.ADMIN_ID ?? '20211561';

const options: DynamoDBClientConfig = {
  region: awsRegion,
};

if (process.env.AWS_SAM_LOCAL) {
  options.endpoint = 'http://localhost:8000';
}

export const dynamoDB = new DynamoDBClient({});
