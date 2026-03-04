import { z } from "zod"

// 1. The Base Pagination Schema (Shared by everyone)
export const BaseQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	search: z.string().optional(),
})

/**
 * 2. The Factory Function
 * @param filterSchema - A Zod object specific to the model (e.g., User status)
 * @param sortFields - An enum of valid fields to sort by
 */
export const createCollectionQuerySchema = <T extends z.ZodRawShape>(
	filterSchema: T,
	sortFields: [string, ...string[]]
) => {
	return BaseQuerySchema.extend({
		sortBy: z.enum(sortFields).optional(),
	}).extend(filterSchema)
}
