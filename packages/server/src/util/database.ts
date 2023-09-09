import type { ServiceConfigurationOptions } from 'aws-sdk/lib/service.ts';
import type { ClientApiVersions } from 'aws-sdk/clients/dynamodb.ts';
import AWS from 'aws-sdk';

const awsRegion = process.env.AWS_REGION ?? 'ap-southeast-2';
export const TableName = process.env.TABLE_NAME ?? 'LockerTable';
export const adminId = process.env.ADMIN_ID ?? '20211561';

const options: ServiceConfigurationOptions & ClientApiVersions = {
  apiVersion: '2012-08-10',
  region: awsRegion,
};

if (process.env.AWS_SAM_LOCAL) {
  options.endpoint = new AWS.Endpoint('http://dynamodb:8000');
}

export const dynamoDB = new AWS.DynamoDB(options);
