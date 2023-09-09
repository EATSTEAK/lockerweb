import https from 'https';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { createResponse, JWT_SECRET, SSUTODAY_SECRET } from '../../common.js';
import {
  BadRequestError,
  errorResponse,
  ForbiddenError,
  InternalError,
  responseAsLockerError,
  UnauthorizedError,
} from '../../util/error.js';
import { issueToken } from '../data.js';

function requestBody(result: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(`https://canvas.ssu.ac.kr/learningx/login/from_cc?result=${result}`, (res) => {
        let body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          resolve(body);
        });
      })
      .on('error', (res) => {
        console.log('Error thrown..');
        reject(res);
      });
  });
}

async function requestSsutoday(result: string): Promise<string> {
  const data = JSON.stringify({
    ssoToken: result,
  });
  const options = {
    hostname: 'backend.ssu.today',
    port: 443,
    path: '/sso/validateToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SSUtoday-Client-Id': 'itlocker',
      'X-SSUtoday-Client-Secret': SSUTODAY_SECRET,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https
      .request(options, (res) => {
        let body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          resolve(body);
        });
      })
      .on('error', (res) => {
        console.log('Error thrown..');
        reject(res);
      });
    req.write(data);
    req.end();
  });
}

async function obtainIdFromSsu(result: string) {
  const body = await requestBody(encodeURIComponent(result));
  if (body.indexOf('pseudonym_session_unique_id') < 0) {
    throw new UnauthorizedError("Can't find pseudonym_session_unique_id");
  }
  return body.substring(body.indexOf('pseudonym_session_unique_id') + 36).split('"')[0];
}

type SsuTodayResponse = {
  statusCode: 'SSU4000' | 'SSU4001' | 'SSU4160' | 'SSU2160';
  data: null | { studentId: number; name: string; major: 'cse' | 'sw' | 'media' };
  message: string;
};

async function obtainIdFromSsuToday(result: string) {
  const response: SsuTodayResponse = JSON.parse(await requestSsutoday(result)) as SsuTodayResponse;
  switch (response.statusCode) {
    case 'SSU4000':
      throw new BadRequestError(response.message);
    case 'SSU4001':
      throw new UnauthorizedError(response.message);
    case 'SSU4160':
      throw new ForbiddenError(response.message);
    case 'SSU2160':
      return `${response.data?.studentId}`;
    default:
      console.error(response);
      throw new InternalError('Service ssutoday sent incorrect response.');
  }
}

function obtainId(result: string, service?: string) {
  switch (service) {
    case 'ssutoday':
      return obtainIdFromSsuToday(result);
    default:
  }
  return obtainIdFromSsu(result);
}

export const loginHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const result = event?.queryStringParameters?.result;
    const service = event?.queryStringParameters?.service;
    if (result) {
      const id = service ? await obtainId(result, service) : await obtainId(result);
      const accessToken = jwt.sign({ aud: id }, JWT_SECRET, {
        expiresIn: 3600 * 1000,
      });
      const issued = await issueToken(id, accessToken);
      const left = Math.floor((issued.expires - Date.now()) / 1000);
      const res = {
        success: true,
        result: {
          id,
          accessToken,
          tokenType: 'Bearer',
          expiresIn: left,
        },
      };
      return createResponse(200, { success: true, ...res });
    }
    return errorResponse(new UnauthorizedError('No result parameter provided'));
  } catch (e) {
    return responseAsLockerError(e);
  }
};
