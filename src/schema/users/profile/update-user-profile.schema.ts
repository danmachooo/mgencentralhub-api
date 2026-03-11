import { createUserProfileSchema } from "@/schema/users/profile/create-user-profile.schema"
import z from "zod"

export const updateUserProfileSchema = createUserProfileSchema
	.partial()
	.omit({
		roleId: true
	})
	.extend({
		name: z.string().min(1).max(30)
	})

