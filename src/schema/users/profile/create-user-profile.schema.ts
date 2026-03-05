import { z } from "zod"

export const createUserProfileSchema = z.strictObject({
	id: z.string().min(1),
	roleId: z.uuid().min(1),
	departmentId: z.uuid().min(1),
})
