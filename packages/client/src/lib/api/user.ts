/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';
import { apiRequest } from '$lib/api/api';
import {
	BadRequestErrorSchema,
	createErrorResponse,
	createSuccessResponse,
	ForbiddenErrorSchema,
	NotFoundErrorSchema
} from '$lib/api/schema';

const UserSchema = z.object({
	id: z.string().regex(/\d+/),
	name: z.string().nullable().default(null),
	isAdmin: z.boolean().default(false),
	department: z.string().nullable().default(null),
	lockerId: z.string().optional(),
	claimedUntil: z
		.preprocess(
			(num: number) => (typeof num === 'number' && num >= 0 ? new Date(num) : null),
			z.date().nullable().optional()
		)
		.optional()
});

const UserUpdateRequestSchema = z.object({
	id: z.string().regex(/\d+/),
	name: z.string().optional(),
	isAdmin: z.boolean().optional(),
	department: z.string().optional(),
	lockerId: z.string().optional(),
	claimedUntil: z.string().optional()
});

const BatchUserPutRequestSchema = z.array(
	z.object({
		id: z.string().regex(/\d+/),
		name: z.string(),
		isAdmin: z.boolean(),
		department: z.string(),
		lockerId: z.string().optional(),
		claimedUntil: z.string().optional()
	})
);

const UserDeleteRequestSchema = z.object({ id: z.string() });

export async function apiGetUser(
	id?: string
): Promise<SuccessResponse<User> | ErrorResponse<ForbiddenError | NotFoundError>> {
	const response = await apiRequest<UserResponse>(
		`/user${id ? '?id=' + encodeURIComponent(id) : ''}`,
		true
	);
	const get = createSuccessResponse(UserSchema).safeParse(response);
	if (get.success) {
		return get.data as SuccessResponse<User>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const notFound = createErrorResponse(NotFoundErrorSchema).safeParse(response);
	if (notFound.success) {
		return notFound.data as ErrorResponse<NotFoundError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function apiUpdateUser(
	userUpdateRequest: UserUpdateRequest
): Promise<SuccessResponse<never> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<never>('/user/update', true, {
		method: 'POST',
		body: userUpdateRequest
	});
	const update = createSuccessResponse().safeParse(response);
	if (update.success) {
		return update.data as SuccessResponse<never>;
	}
	const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
	if (badRequest.success) {
		return badRequest.data as ErrorResponse<BadRequestError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function apiDeleteUser(
	userDeleteRequest: UserDeleteRequest
): Promise<SuccessResponse<UserDeleteRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<UserDeleteRequest>('/user/delete', true, {
		method: 'POST',
		body: userDeleteRequest
	});
	const deleteValidation = createSuccessResponse(UserDeleteRequestSchema).safeParse(response);
	if (deleteValidation.success) {
		return deleteValidation.data as SuccessResponse<UserDeleteRequest>;
	}
	const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
	if (badRequest.success) {
		return badRequest.data as ErrorResponse<BadRequestError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
}

export async function apiQueryUser(
	starts?: string
): Promise<SuccessResponse<User[]> | ErrorResponse<ForbiddenError | NotFoundError>> {
	const response = await apiRequest<UserResponse[]>(
		`/user/query${starts ? '?starts=' + encodeURIComponent(starts) : ''}`,
		true
	);
	const query = createSuccessResponse(z.array(UserSchema)).safeParse(response);
	if (query.success) {
		return query.data as SuccessResponse<User[]>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const notFound = createErrorResponse(NotFoundErrorSchema).safeParse(response);
	if (notFound.success) {
		return notFound.data as ErrorResponse<NotFoundError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function apiBatchPutUser(
	users: User[]
): Promise<SuccessResponse<never> | ErrorResponse<BadRequestError | ForbiddenError>> {
	function toUserResponse(user: User) {
		return {
			...user,
			...(user.claimedUntil && { claimedUntil: user.claimedUntil.toISOString() })
		};
	}

	const response = await apiRequest<never>('/user/batch/put', true, {
		method: 'POST',
		body: users.map(toUserResponse)
	});
	const batchPut = createSuccessResponse().safeParse(response);
	if (batchPut.success) {
		return batchPut.data as SuccessResponse<never>;
	}
	const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
	if (badRequest.success) {
		return badRequest.data as ErrorResponse<BadRequestError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function apiBatchDeleteUser(
	batchUserDeleteRequest: string[]
): Promise<SuccessResponse<never> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<never>('/user/batch/delete', true, {
		method: 'POST',
		body: batchUserDeleteRequest
	});
	const batchDelete = createSuccessResponse().safeParse(response);
	if (batchDelete.success) {
		return batchDelete.data as SuccessResponse<never>;
	}
	const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
	if (badRequest.success) {
		return badRequest.data as ErrorResponse<BadRequestError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}
