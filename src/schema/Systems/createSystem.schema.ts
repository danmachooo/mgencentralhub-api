import { SystemStatus } from "@prisma/client"
import { z } from "zod"

export const creatorIdentifierSchema = z.object({
	id: z.string().min(1),
})

export const createSystemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	image: z.string().min(1),
	url: z.url({
		protocol: /^https$/,
		error: "URL must be https.",
	}),
	status: z.enum(SystemStatus).default(SystemStatus.ACTIVE),
	departmentIds: z.array(z.uuid()).min(1),
})
