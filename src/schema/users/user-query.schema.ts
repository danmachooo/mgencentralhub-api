import { createCollectionQuerySchema } from "@/schema/shared/request-query.schema"
import { z } from "zod"

export const userProfileQuerySchema = createCollectionQuerySchema(
	{
		role: z.string().optional(),
	},
	["createdAt", "role"]
)
