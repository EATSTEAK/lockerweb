/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';
import { apiRequest } from '$lib/api/api';
import {
  BadRequestErrorSchema,
  BlockedErrorSchema,
  createErrorResponse,
  createSuccessResponse,
  ForbiddenErrorSchema,
  UnauthorizedErrorSchema,
} from '$lib/api/schema';

const LoginSuccessResponseSchema = z.object({
  id: z.string().regex(/\d+/),
  accessToken: z.string(),
  tokenType: z.enum(['Bearer']),
  expiresIn: z.number(),
});

const LogoutSuccessResponseSchema = z.object({
  accessToken: z.string(),
});

export type LoginSuccessResponse = z.infer<typeof LoginSuccessResponseSchema>;

export type LogoutSuccessResponse = z.infer<typeof LogoutSuccessResponseSchema>;

export async function apiLogin(
  result: string,
  service: string = null,
): Promise<
  | SuccessResponse<LoginSuccessResponse>
  | ErrorResponse<BadRequestError | UnauthorizedError | BlockedError | ForbiddenError>
> {
  const requestStr =
    '/auth/login?result=' + encodeURIComponent(result) + (service ? `&service=${service}` : '');
  const response = await apiRequest<LoginSuccessResponse>(requestStr, false);
  const login = createSuccessResponse(LoginSuccessResponseSchema).safeParse(response);
  if (login.success) {
    return login.data as SuccessResponse<LoginSuccessResponse>;
  }
  const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
  if (badRequest.success) {
    return badRequest.data as ErrorResponse<BadRequestError>;
  }
  const unauthorized = createErrorResponse(UnauthorizedErrorSchema).safeParse(response);
  if (unauthorized.success) {
    return unauthorized.data as ErrorResponse<UnauthorizedError>;
  }
  const blocked = createErrorResponse(BlockedErrorSchema).safeParse(response);
  if (blocked.success) {
    return blocked.data as ErrorResponse<BlockedError>;
  }
  const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
  if (forbidden.success) {
    return forbidden.data as ErrorResponse<ForbiddenError>;
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
