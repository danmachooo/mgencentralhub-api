import { z } from "zod"

export const createSystemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	image: z.string().min(1),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
	statusId: z.uuid().min(1),
	departmentIds: z.array(z.uuid()).optional(),
})
