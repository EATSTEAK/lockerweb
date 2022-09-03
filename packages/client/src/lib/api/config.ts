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

const LockerSubsectionSchema = z.object({
	department: z.string(),
	range: z.tuple([z.number(), z.number()])
});

const LockerSectionSchema = z.object({
	subsections: z.array(LockerSubsectionSchema).default([]),
	disabled: z.array(z.number()).default([]),
	height: z.number()
});

const BuildingSchema = z.object({
	id: z.string().regex(/\d{2}/),
	name: z.string(),
	lockers: z.record(z.record(LockerSectionSchema).default({})).default({})
});

const ConfigSchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	activateFrom: z.optional(z.preprocess((isoDateStr: string) => new Date(isoDateStr), z.date())),
	activateTo: z.optional(z.preprocess((isoDateStr: string) => new Date(isoDateStr), z.date()))
});

const DepartmentConfigSchema = ConfigSchema.extend({
	contact: z.string().optional()
});

const ServiceConfigSchema = ConfigSchema.extend({
	buildings: BuildingSchema.default({})
});

const ConfigUpdateRequestSchema = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	activateFrom: z.string().optional(),
	activateTo: z.string().optional(),
	contact: z.string().optional(),
	buildings: BuildingSchema.optional()
});

export async function apiGetConfig(): Promise<
	SuccessResponse<Config[]> | ErrorResponse<NotFoundError>
> {
	const response = await apiRequest<ConfigResponse[]>('/config');
	const get = createSuccessResponse(z.array(ConfigSchema)).safeParse(response);
	if (get.success) {
		return get.data as SuccessResponse<Config[]>;
	}
	const notFound = createErrorResponse(NotFoundErrorSchema).safeParse(response);
	if (notFound.success) {
		return notFound.data as ErrorResponse<NotFoundError>;
	}
	const other = createErrorResponse().parse(response);
	throw other.error;
}

export function getServiceConfig(configs: Config[]): ServiceConfig {
	return (
		(configs.find((c: Config) => c.id === 'SERVICE') as ServiceConfig) ?? {
			id: 'SERVICE',
			name: null,
			buildings: {}
		}
	);
}

export function getDepartmentConfig(configs: Config[], departmentId: string): DepartmentConfig {
	return configs.find((c: Config) => c.id === departmentId) as DepartmentConfig;
}

export function getDepartmentConfigs(configs: Config[]): DepartmentConfig[] {
	return configs.filter((c: Config) => c.id !== 'SERVICE') as DepartmentConfig[];
}

export async function apiUpdateConfig(
	updateRequest: ConfigUpdateRequest
): Promise<SuccessResponse<ConfigUpdateRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<ConfigUpdateRequest>('/config/update', true, updateRequest);
	const update = createSuccessResponse(ConfigUpdateRequestSchema).safeParse(response);
	if (update.success) {
		return update.data as SuccessResponse<ConfigUpdateRequest>;
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

export async function apiDeleteConfig(
	configDeleteRequest: ConfigDeleteRequest
): Promise<SuccessResponse<ConfigDeleteRequest> | ErrorResponse<BadRequestError | ForbiddenError>> {
	const response = await apiRequest<string>('/config/delete', true, configDeleteRequest);
	const deleteValidation = createSuccessResponse(z.object({ id: z.string() })).safeParse(response);
	if (deleteValidation.success) {
		return deleteValidation.data as SuccessResponse<ConfigDeleteRequest>;
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
