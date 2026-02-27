import { z } from "zod"

export const createSystemFlagSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
})
	