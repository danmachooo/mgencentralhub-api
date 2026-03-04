import { z } from "zod"

export const createDepartmentSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1).optional(),
})
