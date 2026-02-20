import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema"
import { SystemStatus } from "@prisma/client"
import { z } from "zod"

export const systemQuerySchema = createCollectionQuerySchema(
	{
		status: z.enum(SystemStatus).default("ACTIVE").optional(),
	},
	["createdAt", "name"]
)
