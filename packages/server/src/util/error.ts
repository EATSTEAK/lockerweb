import type { APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../common';

export class ResponsibleError extends Error {
	additionalInfo: Record<string, unknown>;

	constructor(message?: string, additionalInfo?: Record<string, unknown>) {
		super(message);
		this.additionalInfo = additionalInfo;
	}

	response(): APIGatewayProxyResult {
		return createResponse(500, {
			success: false,
			error: 500,
			error_description: 'Internal error',
			...this.additionalInfo
		});
	}
}

export class UnauthorizedError extends ResponsibleError {
	response(): APIGatewayProxyResult {
		return createResponse(401, {
			success: false,
			error: 401,
			error_description: this.message,
			...this.additionalInfo
		});
	}
}

export class NotFoundError extends ResponsibleError {
	response(): APIGatewayProxyResult {
		return createResponse(404, {
			success: false,
			error: 404,
			error_description: this.message,
			...this.additionalInfo
		});
	}
}

export class CantClaimError extends ResponsibleError {
	response(): APIGatewayProxyResult {
		return createResponse(403, {
			success: false,
			error: 403,
			error_description: this.message,
			...this.additionalInfo
		});
	}
}
