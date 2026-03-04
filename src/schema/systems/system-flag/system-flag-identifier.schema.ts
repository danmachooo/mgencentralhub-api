import { z } from "zod"

export const systemFlagIdentifierSchema = z.object({
	id: z.uuid().min(1),
})
