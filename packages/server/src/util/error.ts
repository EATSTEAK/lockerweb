import type { APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../common';

export class ResponsibleError extends Error {
	message: string;

	errorCode: number;

	additionalInfo: Record<string, unknown>;

	errorType: string;

	constructor(
		errorCode: number,
		errorType: string,
		message?: string,
		additionalInfo?: Record<string, unknown>
	) {
		super(message);
		this.errorCode = errorCode;
		this.errorType = errorType;
		this.message = message;
		this.additionalInfo = additionalInfo;
	}
}

export class UnauthorizedError extends ResponsibleError {
	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(401, 'UnauthorizedError', message, additionalInfo);
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
	return typeof error === 'object' && Object.keys(error).includes('errorType');
}

export function errorResponse(
	error: ResponsibleError,
	overrideDescription?: string
): APIGatewayProxyResult {
	return createResponse(error.errorCode, {
		success: false,
		error: error.errorCode,
		errorDescription: overrideDescription ?? error.message,
		...error.additionalInfo
	});
}
