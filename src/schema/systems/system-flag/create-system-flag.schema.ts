import { entityBaseSchema } from "@/schema/shared/entity-base.schema"
import { z } from "zod"

export const createSystemFlagSchema = entityBaseSchema.extend({
	name: z.string().min(2).max(15)
})