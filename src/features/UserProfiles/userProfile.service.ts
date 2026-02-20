import type { CreateUserProfileInput, UserIdentifier, UserProfileQuery } from "@/schema"
import { createUserProfile, getUserContext, getUsers } from "@/features/UserProfiles/userProfile.repo"
import { getPrismaPagination, withPrismaErrorHandling } from "@/helpers/prisma"
import { Prisma } from "@prisma/client"

export async function getUserAccessContext(user: UserIdentifier) {
	const accessContext = await getUserContext(user)

	return accessContext
}

export async function createUser(userProfile: CreateUserProfileInput) {
	const profile = await createUserProfile(userProfile)
	return profile
}

export async function getUserInfo(query: UserProfileQuery) {
	const options = getPrismaPagination(query)

	const where: Prisma.UserProfileWhereInput = {
		role: query.role,
		...(query.search && {
			OR: [
				{ 
					user: {
						name: {
							contains: query.search,
							mode: "insensitive"
						},
						email: {
							contains: query.search,
							mode: "insensitive"
						},
					}
			 	}
			],
		}),
	}

	return withPrismaErrorHandling(() => getUsers(where, options), {
		entity: "User Profile",
		notFoundMessage: "User Profile not found."
	})
}