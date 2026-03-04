import {
	createManyRoles,
	createRole,
	hardDeleteRole,
	listSoftDeletedUserRoles,
	listUserRoleById,
	listUserRoles,
	restoreRole,
	softDeleteRole,
	updateRole,
} from "@/features/Users/role/role.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type { CreateRoleInput, RoleIdentifier, UpdateRoleInput } from "@/schema"
import {
	invalidateRoleCache,
	invalidateRoleCollectionCaches,
	withActiveRolesCache,
	withInactiveRolesCache,
	withRoleByIdCache,
} from "@/helpers/shared/cache/role-cache.helper"

const roleErrors = new PrismaErrorHandler({
	entity: "Role",
	uniqueFieldLabels: { name: "role name" },
	notFoundMessage: "Role not found.",
})

export async function createUserRole(role: CreateRoleInput) {
	return roleErrors.exec(async () => {
		const created = await createRole(role)
		await invalidateRoleCollectionCaches()
		return created
	})
}

export async function createManyUserRoles(roles: CreateRoleInput[]) {
	return roleErrors.exec(async () => {
		const created = await createManyRoles(roles)
		await invalidateRoleCollectionCaches()
		return created
	})
}

export async function updateUserRole(role: RoleIdentifier, data: UpdateRoleInput) {
	return roleErrors.exec(async () => {
		const updated = await updateRole(role.id, data)
		await invalidateRoleCache(role.id)
		return updated
	})
}

export async function restoreUserRole(role: RoleIdentifier) {
	return roleErrors.exec(async () => {
		const restored = await restoreRole(role.id)
		await invalidateRoleCache(role.id)
		return restored
	})
}

export async function softDeleteUserRole(role: RoleIdentifier) {
	return roleErrors.exec(async () => {
		const deleted = await softDeleteRole(role.id)
		await invalidateRoleCache(role.id)
		return deleted
	})
}

export async function hardDeleteUserRole(role: RoleIdentifier) {
	return roleErrors.exec(async () => {
		const deleted = await hardDeleteRole(role.id)
		await invalidateRoleCache(role.id)
		return deleted
	})
}

export async function getActiveUserRoles() {
	return withActiveRolesCache(() => roleErrors.exec(() => listUserRoles()))
}

export async function getActiveUserRoleById(role: RoleIdentifier) {
	return withRoleByIdCache(role.id, () => roleErrors.exec(() => listUserRoleById(role.id)))
}

export async function getInactiveUserRoles() {
	return withInactiveRolesCache(() => roleErrors.exec(() => listSoftDeletedUserRoles()))
}
