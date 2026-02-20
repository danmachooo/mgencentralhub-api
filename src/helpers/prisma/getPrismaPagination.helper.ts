import type { BaseQuerySchema } from "@/schema"
import type { z } from "zod"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"

export function getPrismaPagination(query: z.infer<typeof BaseQuerySchema> & { sortBy?: string }): PrismaQueryOptions {
	const { page, limit, sortBy, sortOrder } = query

	return {
		take: limit,
		skip: (page - 1) * limit,
		orderBy: {
			[sortBy ?? "createdAt"]: sortOrder,
		},
	}
}
