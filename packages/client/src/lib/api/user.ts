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
	name: z.string().default(''),
	isAdmin: z.boolean().default(false),
	department: z.string().default(null),
	lockerId: z.string().optional(),
	claimedUntil: z.preprocess(
		(num: number) => (typeof num === 'number' && num >= 0 ? new Date(num) : null),
		z.date().nullable().optional()
	)
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

export async function getUser(
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

export async function updateUser(
	userUpdateRequest: UserUpdateRequest
): Promise<SuccessResponse<UserUpdateRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<UserUpdateRequest>('/user/update', true, userUpdateRequest);
	const update = createSuccessResponse(UserUpdateRequestSchema).safeParse(response);
	if (update.success) {
		return update.data as SuccessResponse<UserUpdateRequest>;
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

export async function deleteUser(
	userDeleteRequest: UserDeleteRequest
): Promise<SuccessResponse<UserDeleteRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<UserDeleteRequest>('/user/delete', true, userDeleteRequest);
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

export async function queryUser(
	starts?: string
): Promise<SuccessResponse<User[]> | ErrorResponse<ForbiddenError | NotFoundError>> {
	const response = await apiRequest<UserResponse[]>(
		`/user/query${starts ? '?starts=' + encodeURIComponent(starts) : ''}`
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

export async function batchPutUser(
	users: User[]
): Promise<SuccessResponse<BatchUserPutRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	function toUserResponse(user: User) {
		return {
			...user,
			...(user.claimedUntil && { claimedUntil: user.claimedUntil.toISOString() })
		};
	}
	const response = await apiRequest<BatchUserPutRequest>(
		'/user/batch/put',
		true,
		users.map(toUserResponse)
	);
	const batchPut = createSuccessResponse(BatchUserPutRequestSchema).safeParse(response);
	if (batchPut.success) {
		return batchPut.data as SuccessResponse<BatchUserPutRequest>;
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

export async function batchDeleteUser(
	batchUserDeleteRequest: string[]
): Promise<SuccessResponse<string[]> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<string[]>('/user/batch/delete', true, batchUserDeleteRequest);
	const batchDelete = createSuccessResponse(z.array(z.string())).safeParse(response);
	if (batchDelete.success) {
		return batchDelete.data as SuccessResponse<string[]>;
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
