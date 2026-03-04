import z from "zod"

export const roleIdentifierSchema = z.object({
	id: z.uuid().min(1),
})
