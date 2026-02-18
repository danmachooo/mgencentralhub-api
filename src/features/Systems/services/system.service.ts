import type { CreateSystemInput, CreatorIdentifier, SystemIdentifier, UpdateSystemInput } from "@/schema"
import { getUserAccessContext } from "@/features/UserProfiles/services/userProfile.service"
import { NotFoundError } from "@/errors"
import { createSystem, getSystem, updateSystem } from "@/features/Systems/repos/system.repo"

export async function createCompanySystem(creator: CreatorIdentifier, data: CreateSystemInput) {
	const ctx = await getUserAccessContext(creator)

	if (!ctx) throw new NotFoundError("User was not found.")

	return await createSystem(ctx.userId, data)
}

export async function updateCompanySystem(system: SystemIdentifier, data: UpdateSystemInput) {
	const _system = await getSystem(system.id)

	if (!_system) throw new NotFoundError("System was not found.")

	return await updateSystem(_system.id, data)
}
