import { prisma } from "@/lib/prisma"
import type { CreateUserProfileInput, UpdateUserProfileInput, UserIdentifier } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const USER_SHAPE: Prisma.UserProfileSelect = {
	userId: true,
	createdAt: true,
	role: {
		select: {
			id: true,
			name: true,
		},
	},
	department: {
		select: {
			id: true,
			name: true,
		},
	},
	user: {
		select: {
			email: true,
			name: true,
			image: true,
		},
	},
}

export async function getUserContext(user: UserIdentifier) {
	return prisma.userProfile.findUniqueOrThrow({
		where: {
			userId: user.id,
		},
		select: {
			userId: true,
			role: {
				select: {
					id: true,
					name: true,
				},
			},
			department: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	})
}

export async function createUserProfile(userProfile: CreateUserProfileInput) {
	return prisma.userProfile.create({
		data: {
			userId: userProfile.id,
			roleId: userProfile.roleId,
			departmentId: userProfile.departmentId,
		},
	})
}

export async function updateUserProfile(id: string, userProfile: UpdateUserProfileInput) {
	if (userProfile.name) {
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				name: userProfile.name,
			},
		})
	}

	return await prisma.userProfile.update({
		where: {
			userId: id,
		},
		data: {
			roleId: userProfile.roleId,
			departmentId: userProfile.departmentId,
		},
		select: {
			updatedAt: true,
			userId: true,
		},
	})
}

export async function getUsers(where: Prisma.UserProfileWhereInput, options: PrismaQueryOptions) {
	const [users, total] = await Promise.all([
		prisma.userProfile.findMany({
			where,
			...options,
			select: USER_SHAPE,
		}),
		prisma.userProfile.count({
			where,
		}),
	])

	return {
		users,
		total,
	}
}
