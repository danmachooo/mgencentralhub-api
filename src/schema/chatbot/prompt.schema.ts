import z from "zod"

export const promptSchema = z.strictObject({
	message: z.string().min(1).max(100),
})
