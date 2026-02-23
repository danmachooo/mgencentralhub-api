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
} from "@/features/UserRole/userRole.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { CreateRoleInput, RoleIdentifier, UpdateRoleInput } from "@/schema"

const roleErrors = new PrismaErrorHandler({
	entity: "Role",
	uniqueFieldLabels: { name: "role name" },
	notFoundMessage: "Role not found.",
})

export async function createUserRole(role: CreateRoleInput) {
	return roleErrors.exec(() => createRole(role))
}

export async function createManyUserRoles(roles: CreateRoleInput[]) {
	return roleErrors.exec(() => createManyRoles(roles))
}

export async function updateUserRole(role: RoleIdentifier, data: UpdateRoleInput) {
	return roleErrors.exec(() => updateRole(role.id, data))
}

export async function restoreUserRole(role: RoleIdentifier) {
	return roleErrors.exec(() => restoreRole(role.id))
}

export async function softDeleteUserRole(role: RoleIdentifier) {
	return roleErrors.exec(() => softDeleteRole(role.id))
}

export async function hardDeleteUserRole(role: RoleIdentifier) {
	return roleErrors.exec(() => hardDeleteRole(role.id))
}

export async function getActiveUserRoles() {
	return roleErrors.exec(() => listUserRoles())
}

export async function getActiveUserRoleById(role: RoleIdentifier) {
	return roleErrors.exec(() => listUserRoleById(role.id))
}

export async function getInactiveUserRoles() {
	return roleErrors.exec(() => listSoftDeletedUserRoles())
}
