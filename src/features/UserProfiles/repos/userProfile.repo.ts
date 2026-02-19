import { prisma } from "@/lib/prisma"
import type { CreateUserProfileInput, UserIdentifier } from "@/schema"

export async function getUserContext(user: UserIdentifier) {
	return prisma.userProfile.findUnique({
		where: {
			userId: user.id,
		},
		select: {
			userId: true,
			role: true,
			departmentId: true,
		},
	})
}

export async function createUserProfile(userProfile: CreateUserProfileInput) {
	return prisma.userProfile.create({
		data: {
			userId: userProfile.id,
			role: userProfile.role,
			departmentId: userProfile.department
		}
	})
}