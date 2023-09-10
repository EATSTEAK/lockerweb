import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'this-is-sample-key-of-ssu-lockerweb-service-please-change-it-before-using-in-production-if-you-wont-change-you-made-a-terrible-security-mistakes-so-please-change-it-right-now-if-you-see-this-passphase-this-is-sample-key-of-ssu-lockerweb-service-please-change-it-before-using-in-production-if-you-wont-change-you-made-a-terrible-security-mistakes-so-please-change-it-right-now-if-you-see-this-passphase';

export function createResponse(statusCode: number, body: string | object): APIGatewayProxyResult {
  const stringifyBody = typeof body === 'string' ? body : JSON.stringify(body);
  const res: APIGatewayProxyResult = {
    statusCode,
    body: stringifyBody,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (process.env.AWS_SAM_LOCAL) {
    res.headers['Access-Control-Allow-Origin'] = '*';
  }
  return res;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const localCorsHandler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
      'Access-Control-Allow-Methods': 'POST, GET',
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
};
