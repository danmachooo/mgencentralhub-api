import type { CreateUserProfileInput, UpdateUserProfileInput, UserIdentifier, UserProfileQuery } from "@/schema"
import {
	createUserProfile,
	getUserContext,
	getUsers,
	updateUserProfile,
} from "@/features/Users/Profile/userProfile.repo"
import { getPrismaPagination, PrismaErrorHandler } from "@/helpers/prisma"
import type { Prisma } from "@prisma/client"

const userProfileErrors = new PrismaErrorHandler({
	entity: "User Profile",
	notFoundMessage: "User profile not found.",
})

export async function getUserAccessContext(user: UserIdentifier) {
	return userProfileErrors.exec(() => getUserContext(user))
}

export async function createUser(userProfile: CreateUserProfileInput) {
	return userProfileErrors.exec(() => createUserProfile(userProfile))
}

export async function getUserInfo(query: UserProfileQuery) {
	const options = getPrismaPagination(query)

	const where: Prisma.UserProfileWhereInput = {
		role: {
			name: query.role, //this needs to be id or raw name
		},
		...(query.search && {
			OR: [
				{
					user: {
						name: {
							contains: query.search,
							mode: "insensitive",
						},
						email: {
							contains: query.search,
							mode: "insensitive",
						},
					},
				},
			],
		}),
	}

	return userProfileErrors.exec(() => getUsers(where, options))
}

export async function updateUser(user: UserIdentifier, data: UpdateUserProfileInput) {
	return userProfileErrors.exec(() => updateUserProfile(user.id, data))
}
