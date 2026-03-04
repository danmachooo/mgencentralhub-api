import { z } from "zod"

export const updateUserProfileSchema = z.object({
	name: z.string().optional(),
	roleId: z.uuid().optional(),
	departmentId: z.uuid().optional(),
})
