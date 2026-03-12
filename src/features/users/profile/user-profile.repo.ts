import { prisma } from "@/lib/prisma"
import type { CreateUserProfileInput, UpdateUserProfileInput, UserIdentifier } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prisma-option.types"
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

export async function createUserProfile(data: CreateUserProfileInput) {
	return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		let profile = await tx.userProfile.findUnique({
			where: {
				userId: data.id
			}
		})
		if(!profile) {
			const roleId = data.roleId
				? data.roleId
				: (
					await tx.role.findUniqueOrThrow({
						where: {
							name: "EMPLOYEE",
						},
						select: {
							id: true
						}
					})
				).id

			profile = await tx.userProfile.create({
				data:{
					userId: data.id,
					roleId,
					departmentId: data.departmentId,
				}
			})
		}

		return profile
	})
}

export async function getUserProfileRecord(user: UserIdentifier) {
	return await prisma.userProfile.findUniqueOrThrow({
		 where: { userId: user.id }, include: {
		role: true,
		department: true
	} })
}

export async function getUserFromSelf(user: UserIdentifier) {
	return await prisma.user.findUniqueOrThrow({
		where: {
			id: user.id
		},
	})
}

export async function getUserContext(user: UserIdentifier) {
	return await prisma.user.findUniqueOrThrow({
		where: {
			id: user.id,
		},
		include: {
			profile: {
				include: {
					role: true,
					department: true
				}
			}
		}
	})
}


export async function updateUserProfile(id: string, userProfile: UpdateUserProfileInput) {
	return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		if(userProfile.name) {
			await tx.user.update({
				where: {
					id
				}, 
				data: {
					name: userProfile.name
				}
			})
		}

		return tx.userProfile.update({
			where: {
				userId: id
			}, 
			data: {
				roleId: userProfile.roleId,
				departmentId: userProfile.departmentId
			},
			select: {
				updatedAt: true,
				userId: true
			}
		})
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
