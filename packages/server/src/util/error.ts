import type { APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../common';

export class ResponsibleError extends Error {
	message: string;

	errorCode: number;

	additionalInfo: Record<string, unknown>;

	errorName: string;

	constructor(
		errorCode: number,
		errorName: string,
		message?: string,
		additionalInfo?: Record<string, unknown>
	) {
		super(message);
		this.errorCode = errorCode;
		this.errorName = errorName;
		this.message = message;
		this.additionalInfo = additionalInfo;
	}
}

export class BadRequestError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(400, 'BadRequest', message, additionalInfo);
	}
}

export class UnauthorizedError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(401, 'Unauthorized', message, additionalInfo);
	}
}

export class ForbiddenError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'Forbidden', message, additionalInfo);
	}
}

export class BlockedError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'Blocked', message, additionalInfo);
	}
}

export class NotFoundError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(404, 'NotFound', message, additionalInfo);
	}
}

export class CantClaimError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'CantClaim', message, additionalInfo);
	}
}

export class InternalError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(500, 'InternalError', message, additionalInfo);
	}
}

export function isResponsibleError(error: unknown) {
	return typeof error === 'object' && Object.keys(error).includes('errorName');
}

export function errorResponse(
	error: ResponsibleError,
	overrideDescription?: string
): APIGatewayProxyResult {
	return createResponse(error.errorCode, {
		success: false,
		error: {
			code: error.errorCode,
			name: error.errorName,
			description: overrideDescription ?? error.message,
			...error.additionalInfo
		}
	});
}

export function responseAsResponsibleError(
	error: unknown,
	fallback: ResponsibleError = new InternalError()
) {
	if (isResponsibleError(error)) return errorResponse(error as ResponsibleError);
	console.error(error);
	return errorResponse(fallback);
}
