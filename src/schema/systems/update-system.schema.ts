import { z } from "zod"

export const updateSystemSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	url: z
		.url({
			protocol: /^https$/,
			error: "URL must be https.",
		})
		.optional(),
	statusId: z.uuid().optional(),
	departmentIds: z.array(z.uuid()).optional(),
})
