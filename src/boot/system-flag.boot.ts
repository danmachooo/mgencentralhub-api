import { PrismaErrorHandler } from "@/helpers/prisma"
import type { CreateManySystemFlagInput } from "@/schema"
import { logger, prisma } from "@/lib"
import { createManyFlags } from "@/features/Systems/SystemFlags/flag.service"

const bootFlagErrors = new PrismaErrorHandler({
	entity: "System Flags",
})

export async function createManySystemFlagsBoot() {
	const result = await prisma.systemFlag.findMany({
		select: {
			id: true,
		},
	})

	if (result.length > 0) {
		return
	}

	const flags: CreateManySystemFlagInput = [
		{
			name: "Active",
			description: "System flag for active systems.",
		},
		{
			name: "Inactive",
			description: "System flag for inactive systems.",
		},
		{
			name: "Maintenance",
			description: "System flag for under maintenance systems.",
		},
		{
			name: "Coming Soon",
			description: "System flag for under development systems.",
		},
	]

	logger.info("System flags creation in progress ...")
	await bootFlagErrors.exec(() => createManyFlags(flags))
	logger.info("System flags has been created. :)")
}
