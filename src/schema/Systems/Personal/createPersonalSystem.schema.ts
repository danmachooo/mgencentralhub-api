import { z } from "zod"

export const createPersonalSystemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	image: z.string().min(1).optional(),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
})
