import { z } from "zod"

export const systemIdentifierSchema = z.object({
	id: z.uuid().min(1),
})
