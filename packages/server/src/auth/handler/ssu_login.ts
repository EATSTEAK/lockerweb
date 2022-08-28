import https from 'https';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';
import { createResponse } from '../../common';
import {
	errorResponse,
	isResponsibleError,
	ResponsibleError,
	UnauthorizedError
} from '../../util/error';
import { issueToken } from '../data';
import { queryConfig } from '../../config/data';
import { adminId } from '../../util/database';

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

async function obtainId(result: string) {
	const body = await requestBody(encodeURIComponent(result));
	if (body.indexOf('pseudonym_session_unique_id') < 0) {
		throw new UnauthorizedError('Unauthorized');
	}
	return body.substring(body.indexOf('pseudonym_session_unique_id') + 36).split('"')[0];
}

export const ssuLoginHandler: APIGatewayProxyHandler = async (event) => {
	try {
		const result = event?.queryStringParameters?.result;
		if (result) {
			console.log(result);
			const id = await obtainId(result);
			const config = await queryConfig();
			const blockedDepartments = config
				.filter((c) => {
					const activateFrom = new Date(c.activateFrom);
					const activateTo = new Date(c.activateTo);
					return (
						(c.activateFrom && activateFrom.getTime() > Date.now()) ||
						(c.activateTo && activateTo.getTime() < Date.now())
					);
				})
				.map((c) => c.id);
			if (adminId !== id && blockedDepartments.includes('SERVICE')) {
				return createResponse(403, {
					success: false,
					error: 403,
					errorDescription: 'Forbidden'
				});
			}
			const accessToken = jwt.sign({ aud: id }, JWT_SECRET, {
				expiresIn: 3600 * 1000
			});
			const issued = await issueToken(id, accessToken, blockedDepartments);
			const left = Math.floor((issued.expires - Date.now()) / 1000);
			const res = {
				success: true,
				result: {
					id,
					accessToken,
					tokenType: 'Bearer',
					expiresIn: left
				}
			};
			return createResponse(200, { success: true, ...res });
		}
		return errorResponse(new UnauthorizedError('Unauthorized'));
	} catch (e) {
		if (!isResponsibleError(e)) {
			console.error(e);
			const res = {
				success: false,
				error: 500,
				errorDescription: 'Internal error'
			};
			return createResponse(500, res);
		}
		return errorResponse(e as ResponsibleError);
	}
};
