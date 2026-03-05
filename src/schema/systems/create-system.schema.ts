import { entityBaseSchema } from "@/schema/shared/entity-base.schema"
import { z } from "zod"

export const createSystemSchema = entityBaseSchema.extend({
	name: z.string().min(2).max(30),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
	statusId: z.uuid().min(1),
	departmentIds: z.array(z.uuid()).optional(),
})
