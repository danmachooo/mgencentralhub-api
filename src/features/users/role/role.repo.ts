import { prisma } from "@/lib"
import type { CreateManyRoleInput, CreateRoleInput, UpdateRoleInput } from "@/schema"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.RoleWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.RoleWhereInput = {
	NOT: {
		deletedAt: null,
	},
}

const ROLE_SHAPE: Prisma.RoleSelect = {
	id: true,
	name: true,
	description: true,
	createdAt: true,
}

//create role
export async function createRole(role: CreateRoleInput) {
	return await prisma.role.create({
		data: {
			name: role.name,
			description: role.description,
		},
	})
}

//create many role
export async function createManyRoles(roles: CreateManyRoleInput) {
	return await prisma.role.createManyAndReturn({
		data: roles,
		select: {
			id: true,
		},
		skipDuplicates: true,
	})
}

//update role
export async function updateRole(id: string, role: UpdateRoleInput) {
	return await prisma.role.update({
		where: {
			id,
		},
		data: {
			name: role.name,
			description: role.description,
		},
	})
}

//get single role
export async function listUserRoleById(id: string) {
	return await prisma.role.findUniqueOrThrow({
		where: {
			id,
		},
		select: ROLE_SHAPE,
	})
}

//get roles
export async function listUserRoles() {
	const [roles, total] = await Promise.all([
		prisma.role.findMany({
			where: {
				...ACTIVE_ONLY,
			},
			select: ROLE_SHAPE,
		}),
		prisma.role.count({
			where: {
				...ACTIVE_ONLY,
			},
		}),
	])

	return { roles, total }
}

//restore soft deleted role
export async function restoreRole(id: string) {
	return await prisma.role.update({
		where: {
			id,
			NOT: { deletedAt: null },
		},
		data: {
			deletedAt: null,
		},
		select: ROLE_SHAPE,
	})
}

//soft delete role
export async function softDeleteRole(id: string) {
	return await prisma.role.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	})
}

//hard delete role
export async function hardDeleteRole(id: string) {
	return await prisma.role.delete({
		where: {
			id,
		},
	})
}

//list soft deleted user roles
export async function listSoftDeletedUserRoles() {
	const [roles, total] = await Promise.all([
		prisma.role.findMany({
			where: {
				...DELETED_ONLY,
			},
			select: ROLE_SHAPE,
		}),
		prisma.role.count({
			where: {
				...DELETED_ONLY,
			},
		}),
	])

	return {
		roles,
		total,
	}
}
