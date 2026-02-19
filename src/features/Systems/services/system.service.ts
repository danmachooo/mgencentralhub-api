import type { CreateSystemInput, CreatorIdentifier, SystemIdentifier, UpdateSystemInput } from "@/schema"
import { getUserAccessContext } from "@/features/UserProfiles/services/userProfile.service"
import { NotFoundError } from "@/errors"
import { createSystem, getSystem, updateSystem } from "@/features/Systems/repos/system.repo"
import { withPrismaErrorHandling } from "@/helpers/prisma"
import { logger } from "@/lib"

export async function createCompanySystem(creator: CreatorIdentifier, data: CreateSystemInput) {
	logger.info("I have catched this", creator ?? "No creator")
	const ctx = await getUserAccessContext(creator)

	logger.info("System Service: ", ctx )

	if (!ctx) throw new NotFoundError("User was not found.")

	// return await createSystem(ctx.userId, data)

	return withPrismaErrorHandling(
		() => 
			createSystem(ctx.userId, data),
		{
			entity: "System",
			uniqueFieldLabels: {
				name: "system name",
				url: "system url"
			},
			notFoundMessage: "System not found."
		}
	)
}

export async function updateCompanySystem(system: SystemIdentifier, data: UpdateSystemInput) {
	const _system = await getSystem(system.id)

	if (!_system) throw new NotFoundError("System was not found.")

	// return await updateSystem(_system.id, data)

	return withPrismaErrorHandling(
		() =>
			updateSystem(_system.id, data),
		{
			entity: "System",
			uniqueFieldLabels: {
				name: "system name",
				url: "system url"
			},
			notFoundMessage: "System not found."
		}
	)
}
