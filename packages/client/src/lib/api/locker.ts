/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';
import { apiRequest } from '$lib/api/api';
import {
	BadRequestErrorSchema,
	BlockedErrorSchema,
	CantClaimErrorSchema,
	createErrorResponse,
	createSuccessResponse,
	ForbiddenErrorSchema,
	InternalErrorSchema,
	NotFoundErrorSchema
} from '$lib/api/schema';

const ReservedLockerSchema = z.object({
	id: z.string().regex(/\d+/).optional(),
	lockerId: z.string(),
	claimedUntil: z.preprocess((isoString: string) => new Date(isoString), z.date()).optional()
});

const ClaimLockerResponseSchema = ReservedLockerSchema;

const UnclaimLockerResponseSchema = z.object({
	id: z.string().regex(/\d+/).optional(),
	lockerId: z.string()
});

const LockerCountResponseSchema = z.record(z.record(z.number()));

export async function queryLocker(
	showId = false
): Promise<SuccessResponse<ReservedLocker[]> | ErrorResponse<ForbiddenError | NotFoundError>> {
	const response = await apiRequest<ReservedLockerResponse[]>(
		`/locker/query${showId ? '?show_id=true' : ''}`,
		true
	);
	const query = createSuccessResponse(z.array(ReservedLockerSchema)).safeParse(response);
	if (query.success) {
		return query.data as SuccessResponse<ReservedLocker[]>;
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

export async function countLocker(): Promise<
	SuccessResponse<LockerCountResponse> | ErrorResponse<NotFoundError>
> {
	const response = await apiRequest<LockerCountResponse>('/locker/count');
	const count = createSuccessResponse(LockerCountResponseSchema).safeParse(response);
	if (count.success) {
		return count.data as SuccessResponse<LockerCountResponse>;
	}
	const notFound = createErrorResponse(NotFoundErrorSchema).safeParse(response);
	if (notFound.success) {
		return notFound.data as ErrorResponse<NotFoundError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function claimLocker(
	lockerId: string,
	claimedUntil?: Date
): Promise<
	| SuccessResponse<ReservedLocker>
	| ErrorResponse<BadRequestError | BlockedError | ForbiddenError | CantClaimError | InternalError>
> {
	const response = await apiRequest<ClaimLockerResponse>('/locker/claim', true, {
		lockerId,
		...(claimedUntil && { until: claimedUntil.toISOString() })
	});
	const claim = createSuccessResponse(ClaimLockerResponseSchema).safeParse(response);
	if (claim.success) {
		return claim.data as SuccessResponse<ReservedLocker>;
	}
	const badRequest = createErrorResponse(BadRequestErrorSchema).safeParse(response);
	if (badRequest.success) {
		return badRequest.data as ErrorResponse<BadRequestError>;
	}
	const blocked = createErrorResponse(BlockedErrorSchema).safeParse(response);
	if (blocked.success) {
		return blocked.data as ErrorResponse<BlockedError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const cantClaim = createErrorResponse(CantClaimErrorSchema).safeParse(response);
	if (cantClaim.success) {
		return cantClaim.data as ErrorResponse<CantClaimError>;
	}
	const internal = createErrorResponse(InternalErrorSchema).safeParse(response);
	if (internal.success) {
		return internal.data as ErrorResponse<InternalError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export async function unclaimLocker(): Promise<
	| SuccessResponse<UnclaimLockerResponse>
	| ErrorResponse<BlockedError | ForbiddenError | CantClaimError>
> {
	const response = await apiRequest<UnclaimLockerResponse>('/locker/unclaim', true);
	const unclaim = createSuccessResponse(UnclaimLockerResponseSchema).safeParse(response);
	if (unclaim.success) {
		return unclaim.data as SuccessResponse<UnclaimLockerResponse>;
	}
	const blocked = createErrorResponse(BlockedErrorSchema).safeParse(response);
	if (blocked.success) {
		return blocked.data as ErrorResponse<BlockedError>;
	}
	const forbidden = createErrorResponse(ForbiddenErrorSchema).safeParse(response);
	if (forbidden.success) {
		return forbidden.data as ErrorResponse<ForbiddenError>;
	}
	const cantClaim = createErrorResponse(CantClaimErrorSchema).safeParse(response);
	if (cantClaim.success) {
		return cantClaim.data as ErrorResponse<CantClaimError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}
