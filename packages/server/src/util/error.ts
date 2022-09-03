import type { APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../common';

export class LockerError extends Error {
	isLockerError: true;

	message: string;

	code: number;

	additionalInfo: Record<string, unknown>;

	name: string;

	constructor(
		code: number,
		name: string,
		message?: string,
		additionalInfo?: Record<string, unknown>
	) {
		super(message);
		this.code = code;
		this.name = name;
		this.message = message;
		this.additionalInfo = additionalInfo;
	}
}

export class BadRequestError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(400, 'BadRequest', message, additionalInfo);
	}
}

export class UnauthorizedError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(401, 'Unauthorized', message, additionalInfo);
	}
}

export class ForbiddenError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'Forbidden', message, additionalInfo);
	}
}

export class BlockedError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'Blocked', message, additionalInfo);
	}
}

export class NotFoundError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(404, 'NotFound', message, additionalInfo);
	}
}

export class CantClaimError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'CantClaim', message, additionalInfo);
	}
}

export class InternalError extends LockerError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(500, 'InternalError', message, additionalInfo);
	}
}

export function isLockerError(error: unknown) {
	return typeof error === 'object' && (error as LockerError)?.isLockerError;
}

export function errorResponse(error: LockerError, overrideMessage?: string): APIGatewayProxyResult {
	return createResponse(error.code, {
		success: false,
		error: {
			code: error.code,
			name: error.name,
			message: overrideMessage ?? error.message,
			...error.additionalInfo
		}
	});
}

export function responseAsLockerError(
	error: unknown,
	fallback: LockerError = new InternalError(),
	additionalInfo: Record<string, unknown> = {}
) {
	if (isLockerError(error)) {
		if (additionalInfo)
			(error as LockerError).additionalInfo = {
				...(error as LockerError).additionalInfo,
				...additionalInfo
			};
		return errorResponse(error as LockerError);
	}
	console.error(error);
	if (additionalInfo) fallback.additionalInfo = { ...fallback.additionalInfo, ...additionalInfo };
	return errorResponse(fallback);
}
