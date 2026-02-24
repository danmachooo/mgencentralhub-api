import { z } from "zod"

const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
})

const signUpSchema = signInSchema.extend({
	name: z.string().min(1),
	roleId: z.string().min(1),
	departmentId: z.uuid().min(1),
})

export { signInSchema, signUpSchema }
