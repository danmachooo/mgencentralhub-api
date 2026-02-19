import type { CreateUserProfileInput, UserIdentifier } from "@/schema"
import { createUserProfile, getUserContext } from "@/features/UserProfiles/repos/userProfile.repo"

export async function getUserAccessContext(user: UserIdentifier) {
	const accessContext = await getUserContext(user)

	return accessContext
}


export async function createUser(userProfile: CreateUserProfileInput) {
	const profile = await createUserProfile(userProfile)
	return profile
}