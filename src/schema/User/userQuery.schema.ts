import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema"
import { z } from "zod"

export const userProfileQuerySchema = createCollectionQuerySchema(
	{
		role: z.string().optional(),
	},
	["createdAt", "role"]
)
