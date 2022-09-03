/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';
import { apiRequest } from '$lib/api/api';
import {
	BlockedErrorSchema,
	createErrorResponse,
	createSuccessResponse,
	UnauthorizedErrorSchema
} from '$lib/api/schema';

const LoginSuccessResponseSchema = z.object({
	id: z.string().regex(/\d+/),
	accessToken: z.string(),
	tokenType: z.enum(['Bearer']),
	expiresIn: z.number()
});

const LogoutSuccessResponseSchema = z.string();

type LoginSuccessResponse = z.infer<typeof LoginSuccessResponseSchema>;

type LogoutSuccessResponse = z.infer<typeof LogoutSuccessResponseSchema>;

export async function apiSsuLogin(
	result: string
): Promise<
	SuccessResponse<LoginSuccessResponse> | ErrorResponse<UnauthorizedError | BlockedError>
> {
	const response = await apiRequest<LoginSuccessResponse>(
		'/auth/ssu_login?result=' + encodeURIComponent(result),
		false
	);
	const login = createSuccessResponse(LoginSuccessResponseSchema).safeParse(response);
	if (login.success) {
		return login.data as SuccessResponse<LoginSuccessResponse>;
	}
	const unauthorized = createErrorResponse(UnauthorizedErrorSchema).safeParse(response);
	if (unauthorized.success) {
		return unauthorized.data as ErrorResponse<UnauthorizedError>;
	}
	const blocked = createErrorResponse(BlockedErrorSchema).safeParse(response);
	if (blocked.success) {
		return blocked.data as ErrorResponse<BlockedError>;
	}
	const other = createErrorResponse(z.object({})).parse(response);
	throw other.error;
}

export async function apiLogout(): Promise<
	SuccessResponse<LogoutSuccessResponse> | ErrorResponse<UnauthorizedError>
> {
	const response = await apiRequest<LogoutSuccessResponse>('/auth/logout', true);
	const logout = createSuccessResponse(LogoutSuccessResponseSchema).safeParse(response);
	if (logout.success) {
		return logout.data as SuccessResponse<LogoutSuccessResponse>;
	}
	const unauthorized = createErrorResponse(UnauthorizedErrorSchema).safeParse(response);
	if (unauthorized.success) {
		return unauthorized.data as ErrorResponse<UnauthorizedError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}
