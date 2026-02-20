import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema"
import z from "zod"

export const departmentQuerySchema = createCollectionQuerySchema(
	{
		name: z.string().optional(),
	},
	["name", "createdAt"]
)
