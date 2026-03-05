import { entityBaseSchema } from "@/schema/shared/entity-base.schema"
import { z } from "zod"

export const createPersonalSystemSchema = entityBaseSchema.extend({
	name: z.string().min(2).max(30),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
})
