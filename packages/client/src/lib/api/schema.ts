import { z } from 'zod';

export function createSuccessResponse(schema: z.ZodTypeAny = z.any().optional()) {
  return z
    .object({
      success: z.literal(true),
    })
    .extend({
      result: schema,
    })
    .passthrough();
}

export function createErrorResponse(schema: z.ZodTypeAny = z.any().optional()) {
  return z
    .object({
      success: z.literal(false),
    })
    .extend({
      error: schema,
    })
    .passthrough();
}

export const BadRequestErrorSchema = z
  .object({
    code: z.literal(400),
    name: z.literal('BadRequest'),
  })
  .passthrough();

export const UnauthorizedErrorSchema = z
  .object({
    code: z.literal(401),
    name: z.literal('Unauthorized'),
  })
  .passthrough();

export const ForbiddenErrorSchema = z
  .object({
    code: z.literal(403),
    name: z.literal('Forbidden'),
  })
  .passthrough();

export const BlockedErrorSchema = z
  .object({
    code: z.literal(403),
    name: z.literal('Blocked'),
  })
  .passthrough();

export const NotFoundErrorSchema = z
  .object({
    code: z.literal(404),
    name: z.literal('NotFound'),
  })
  .passthrough();

export const CantClaimErrorSchema = z
  .object({
    code: z.literal(403),
    name: z.literal('CantClaim'),
  })
  .passthrough();

export const CantUnclaimErrorSchema = z
  .object({
    code: z.literal(403),
    name: z.literal('CantUnclaim'),
  })
  .passthrough();

export const InternalErrorSchema = z.object({
  code: z.literal(500),
  name: z.literal('InternalError'),
});
