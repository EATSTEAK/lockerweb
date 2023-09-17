/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';
import { apiRequest } from '$lib/api/api';
import {
  BadRequestErrorSchema,
  createErrorResponse,
  createSuccessResponse,
  ForbiddenErrorSchema,
  NotFoundErrorSchema,
} from '$lib/api/schema';

const LockerSubsectionSchema = z.object({
  department: z.string(),
  range: z.tuple([z.number(), z.number()]),
}).strict();

const LockerSectionSchema = z.object({
  subsections: z.array(LockerSubsectionSchema).default([]),
  disabled: z.array(z.number()).default([]),
  height: z.number(),
}).strict();

const BuildingSchema = z.object({
  id: z.string().regex(/\d{2}/),
  name: z.string(),
  lockers: z.record(z.record(LockerSectionSchema).default({})).default({}),
}).strict();

export const ConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  activateFrom: z.optional(z.preprocess((isoDateStr: string) => new Date(isoDateStr), z.date())),
  activateTo: z.optional(z.preprocess((isoDateStr: string) => new Date(isoDateStr), z.date())),
}).strict();

export const DepartmentConfigSchema = ConfigSchema.extend({
  id: z.string().min(1).regex(/[a-zA-Z_]+/).refine((val) => val.toUpperCase() !== "SERVICE"),
  contact: z.string().optional(),
}).strict();

export const ServiceConfigSchema = ConfigSchema.extend({
  id: z.literal("SERVICE"),
  buildings: z.record(BuildingSchema).default({}).optional(),
  alert: z.string().optional(),
}).strict();

// const ConfigUpdateRequestSchema = z.object({
//   id: z.string().min(1),
//   name: z.string().optional(),
//   activateFrom: z.string().optional(),
//   activateTo: z.string().optional(),
//   contact: z.string().optional(),
//   buildings: z.record(BuildingSchema).optional(),
// });

export async function apiGetConfig(): Promise<
  SuccessResponse<Config[]> | ErrorResponse<NotFoundError>
> {
  const response = await apiRequest<ConfigResponse[]>('/config');
  const get = createSuccessResponse(z.array(ConfigSchema.passthrough()))
    .passthrough()
    .safeParse(response);
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
  const foundConfig = configs.find((c: Config) => c.id === 'SERVICE') as ServiceConfig;
  const parsed = ServiceConfigSchema.safeParse(foundConfig);
  if (parsed.success) return parsed.data as ServiceConfig;
  console.error(parsed, foundConfig);
  return {
    id: 'SERVICE',
    name: null,
    buildings: {},
  };
}

export function getDepartmentConfig(configs: Config[], departmentId: string): DepartmentConfig {
  const foundConfig = configs.find((c: Config) => c.id === departmentId);
  const parsed = DepartmentConfigSchema.safeParse(foundConfig);
  if (parsed.success) return parsed.data as DepartmentConfig;
  return null;
}

export function getDepartmentConfigs(configs: Config[]): DepartmentConfig[] {
  const foundConfigs = configs.filter((c: Config) => c.id !== 'SERVICE') as DepartmentConfig[];
  const parsed = z.array(DepartmentConfigSchema).safeParse(foundConfigs);
  if (parsed.success) return parsed.data as DepartmentConfig[];
  return null;
}

export async function apiUpdateConfig(
  updateRequest: ConfigUpdateRequest,
): Promise<SuccessResponse<never> | ErrorResponse<BadRequestError | ForbiddenError>> {
  const response = await apiRequest<never>('/config/update', true, {
    method: 'POST',
    body: updateRequest,
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

export async function apiDeleteConfig(
  configDeleteRequest: ConfigDeleteRequest,
): Promise<SuccessResponse<string> | ErrorResponse<BadRequestError | ForbiddenError>> {
  const response = await apiRequest<string>('/config/delete', true, {
    method: 'POST',
    body: configDeleteRequest,
  });
  const deleteValidation = createSuccessResponse(z.string()).safeParse(response);
  if (deleteValidation.success) {
    return deleteValidation.data as SuccessResponse<string>;
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
