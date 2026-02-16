import { z } from "zod"

export const departmentIdentifierSchema = z.object({
	id: z.uuid().min(1),
})
