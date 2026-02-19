import { UserRole } from "@prisma/client"
import { email, z } from "zod"

const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
})

const signUpSchema = signInSchema.extend({
	name: z.string().min(1),
	role: z.enum(["EMPLOYEE", "ADMIN"]),
	department: z.uuid().min(1)
})

export { signInSchema, signUpSchema }
