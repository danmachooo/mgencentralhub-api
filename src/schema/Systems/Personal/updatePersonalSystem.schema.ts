import { PersonalSystemStatus } from "@prisma/client"
import { z } from "zod"

export const updatePersonalSystemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	image: z.string().min(1),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
	status: z.enum(PersonalSystemStatus).default(PersonalSystemStatus.ACTIVE),
})
