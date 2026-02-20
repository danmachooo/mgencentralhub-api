import { prisma } from "@/lib/prisma"
import type { CreateUserProfileInput, UserIdentifier } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

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
			departmentId: userProfile.departmentId,
		},
	})
}

export async function getUsers(where: Prisma.UserProfileWhereInput, options: PrismaQueryOptions) {
	
}
