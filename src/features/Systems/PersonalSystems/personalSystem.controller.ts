import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared"
import {
	createOwnSystem,
	getOwnSystems,
	getOwnSystemById,
	updateOwnSystem,
	getDeletedOwnSystems,
	restoreOwnSystem,
	softDeleteOwnSystem,
	hardDeleteOwnSystem,
} from "@/features/Systems/PersonalSystems/personalSystem.service"
import {
	createPersonalSystemSchema,
	creatorIdentifierSchema,
	personalSystemIdentifierSchema,
	personalSystemQuerySchema,
	updatePersonalSystemSchema,
} from "@/schema"
import { sendPaginatedResponse } from "@/helpers/shared"

export const createOwnSystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = createPersonalSystemSchema.parse(http.req.body)

	const systemCreated = await createOwnSystem(creator, body)

	return http.res.status(201).json({
		success: true,
		message: "Personal System has been created.",
		data: {
			id: systemCreated.id,
		},
	})
})

export const updateOwnSystemHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = personalSystemIdentifierSchema.parse(http.req.params)
	const body = updatePersonalSystemSchema.parse(http.req.body)

	const systemUpdated = await updateOwnSystem({ id }, body)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been updated.",
		data: {
			id: systemUpdated,
		},
	})
})

export const restoreOwnSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const restoredSystem = await restoreOwnSystem(system)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been restored.",
		data: {
			restoredSystem,
		},
	})
})

export const getOwnSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = personalSystemQuerySchema.parse(http.req.query)

	const { systems, total } = await getOwnSystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Personal Systems retrieved successfully")
})

export const getOwnSystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = personalSystemIdentifierSchema.parse(http.req.params)

	const system = await getOwnSystemById({ id })

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been retrieved.",
		data: {
			system,
		},
	})
})

export const getDeletedOwnSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = personalSystemQuerySchema.parse(http.req.query)

	const { systems, total } = await getDeletedOwnSystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Personal Systems retrieved successfully")
})

export const softDeleteOwnSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	await softDeleteOwnSystem(system)

	return http.res.status(404).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})

export const hardDeleteOwnSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	await hardDeleteOwnSystem(system)

	return http.res.status(410).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})
