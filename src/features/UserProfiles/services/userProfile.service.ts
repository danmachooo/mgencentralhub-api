import type { UserIdentifier } from "@/schema"
import { getUserContext } from "@/features/UserProfiles/repos/userProfile.repo"

export async function getUserAccessContext(user: UserIdentifier) {
	const accessContext = await getUserContext(user)

	return accessContext
}
