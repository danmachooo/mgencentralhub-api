import { createCollectionQuerySchema } from "@/schema/shared/request-query.schema"
import { z } from "zod"

export const systemQuerySchema = createCollectionQuerySchema(
	{
		status: z.string().optional(),
	},
	["createdAt", "name"]
)
