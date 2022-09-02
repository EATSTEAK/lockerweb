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

export class UnauthorizedError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(401, 'UnauthorizedError', message, additionalInfo);
	}
}

export class ForbiddenError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'ForbiddenError', message, additionalInfo);
	}
}

export class NotFoundError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(404, 'NotFoundError', message, additionalInfo);
	}
}

export class CantClaimError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(403, 'CantClaimError', message, additionalInfo);
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
