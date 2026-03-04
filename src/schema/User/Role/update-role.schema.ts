import { z } from "zod"

export const updateRoleSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
})
