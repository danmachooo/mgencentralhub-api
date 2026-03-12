import {
	createManyUserRoles,
	createUserRole,
	getActiveUserRoleById,
	getActiveUserRoles,
	getInactiveUserRoles,
	hardDeleteUserRole,
	restoreUserRole,
	softDeleteUserRole,
	updateUserRole,
} from "@/features/users/role/role.service"
import { asyncHandler } from "@/middlewares"
import { sendResponse } from "@/helpers/shared/send-response.helper"
import { createManyRoleSchema, createRoleSchema, updateRoleSchema } from "@/schema"
import type { HttpContext } from "@/types/shared"
import { roleIdentifierSchema } from "@/schema/users/role/role-identifier.schema"

export const createUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = createRoleSchema.parse(http.req.body)

	const roleCreated = await createUserRole(role)

	return sendResponse(http.res, 201, "Role has been created.", { roleCreated })
})

export const createManyUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const roles = createManyRoleSchema.parse(http.req.body)

	const rolesCreated = await createManyUserRoles(roles)

	return sendResponse(http.res, 200, "Roles has been created.", { rolesCreated })
})

export const updateUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)
	const body = updateRoleSchema.parse(http.req.body)

	const roleUpdated = await updateUserRole(role, body)

	return sendResponse(http.res, 200, "Role has been updated.", { roleUpdated })
})

export const softDeleteUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	await softDeleteUserRole(role)

	return sendResponse(http.res, 200, "Role has been deleted.")
})

export const restoreUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	const restoredRole = await restoreUserRole(role)

	return sendResponse(http.res, 200, "Role has been restored.", { restoredRole })
})

export const hardDeleteUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	await hardDeleteUserRole(role)

	return sendResponse(http.res, 200, "Role has been permanently deleted.")
})

export const getActiveUserRolesHandler = asyncHandler(async (http: HttpContext) => {
	const { roles, total } = await getActiveUserRoles()

	return sendResponse(http.res, 200, "Active roles has been retrieved.", { roles, total })
})

export const getActiveUserRoleByIdHandler = asyncHandler(async (http: HttpContext) => {
	const _role = roleIdentifierSchema.parse(http.req.params)

	const role = await getActiveUserRoleById(_role)

	return sendResponse(http.res, 200, "Active Role has been retrieved.", { role })
})

export const getInactiveUserRolesHandler = asyncHandler(async (http: HttpContext) => {
	const { roles, total } = await getInactiveUserRoles()

	return sendResponse(http.res, 200, "Inactive roles has been retrieved.", { roles, total })
})
