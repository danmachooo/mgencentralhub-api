import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema"
import { z } from "zod"

export const systemQuerySchema = createCollectionQuerySchema(
	{
		status: z.string().optional(),
	},
	["createdAt", "name"]
)
