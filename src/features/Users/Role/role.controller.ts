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
} from "@/features/Users/Role/role.service"
import { asyncHandler } from "@/middlewares"
import { createManyRoleSchema, createRoleSchema, updateRoleSchema } from "@/schema"
import type { HttpContext } from "@/types/shared"
import { roleIdentifierSchema } from "@/schema/Role/roleIdentifier.schema"

export const createUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = createRoleSchema.parse(http.req.body)

	const roleCreated = await createUserRole(role)

	return http.res.status(201).json({
		success: true,
		message: "Role has been created.",
		data: {
			roleCreated,
		},
	})
})

export const createManyUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const roles = createManyRoleSchema.parse(http.req.body)

	const rolesCreated = await createManyUserRoles(roles)

	return http.res.status(200).json({
		success: true,
		message: "Roles has been created.",
		data: {
			rolesCreated,
		},
	})
})

export const updateUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)
	const body = updateRoleSchema.parse(http.req.body)

	const roleUpdated = await updateUserRole(role, body)

	return http.res.status(200).json({
		success: true,
		message: "Role has been updated.",
		data: {
			roleUpdated,
		},
	})
})

export const softDeleteUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	await softDeleteUserRole(role)

	return http.res.status(404).json({
		success: true,
		message: "Role has been deleted.",
	})
})

export const restoreUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	const restoredRole = await restoreUserRole(role)

	return http.res.status(200).json({
		success: true,
		message: "Role has been restored.",
		data: {
			restoredRole,
		},
	})
})

export const hardDeleteUserRoleHandler = asyncHandler(async (http: HttpContext) => {
	const role = roleIdentifierSchema.parse(http.req.params)

	await hardDeleteUserRole(role)

	return http.res.status(410).json({
		success: true,
		message: "Role has been deleted.",
	})
})

export const getActiveUserRolesHandler = asyncHandler(async (http: HttpContext) => {
	const { roles, total } = await getActiveUserRoles()

	return http.res.status(200).json({
		success: true,
		message: "Active roles has been retrieved.",
		data: {
			roles,
			total,
		},
	})
})

export const getActiveUserRoleByIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = roleIdentifierSchema.parse(http.req.params)

	const role = await getActiveUserRoleById({ id })

	return http.res.status(200).json({
		success: true,
		message: "Active Role has been retrieved.",
		data: {
			role,
		},
	})
})

export const getInactiveUserRolesHandler = asyncHandler(async (http: HttpContext) => {
	const { roles, total } = await getInactiveUserRoles()

	return http.res.status(200).json({
		success: true,
		message: "Inactive roles has been retrieved.",
		data: {
			roles,
			total,
		},
	})
})
