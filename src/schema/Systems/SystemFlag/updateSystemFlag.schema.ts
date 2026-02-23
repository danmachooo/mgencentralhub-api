import { z } from "zod"

export const updateSystemFlagSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
})
