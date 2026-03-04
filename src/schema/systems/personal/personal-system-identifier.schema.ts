import z from "zod"

export const personalSystemIdentifierSchema = z.object({
	id: z.uuid().min(1),
})
