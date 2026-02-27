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
	toggleFavoritePersonalSystem,
	getFavoriteOwnSystemById,
	getFavoriteOwnSystems,
} from "@/features/Systems/PersonalSystems/personalSystem.service"
import {
	createPersonalSystemSchema,
	creatorIdentifierSchema,
	personalSystemIdentifierSchema,
	personalSystemQuerySchema,
	updatePersonalSystemSchema,
} from "@/schema"
import { sendPaginatedResponse } from "@/helpers/shared"

export const createPersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = createPersonalSystemSchema.parse(http.req.body)

	const file = http.req.file ?? null

	const systemCreated = await createOwnSystem(creator, body, file)

	return http.res.status(201).json({
		success: true,
		message: "Personal System has been created.",
		data: {
			systemCreated,
		},
	})
})

export const updatePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = updatePersonalSystemSchema.parse(http.req.body)
	const file = http.req.file ?? null

	const systemUpdated = await updateOwnSystem(system, creator, body, file)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been updated.",
		data: {
			systemUpdated,
		},
	})
})

export const toggleFavoritePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const { favorited } = await toggleFavoritePersonalSystem(creator, system)

	return http.res.status(200).json({
		success: true,
		message: favorited ? "Added to favorites." : "Removed from favorites",
	})
})

export const restorePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	const restoredSystem = await restoreOwnSystem(system, creator)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been restored.",
		data: {
			restoredSystem,
		},
	})
})

export const getPersonalSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = personalSystemQuerySchema.parse(http.req.query)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	const { systems, total } = await getOwnSystems(query, creator)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Personal Systems retrieved successfully")
})
export const getFavoritePersonalSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const query = personalSystemQuerySchema.parse(http.req.query)

	const { favorites, total } = await getFavoriteOwnSystems(creator, query)

	return sendPaginatedResponse(
		http,
		{ data: favorites, total },
		query,
		"Favorite Personal Systems retrieved successfully"
	)
})

export const getPersonalSystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const _system = personalSystemIdentifierSchema.parse(http.req.params)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	const system = await getOwnSystemById(_system, creator)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been retrieved.",
		data: {
			system,
		},
	})
})

export const getFavoritePersonalSystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const favorite = await getFavoriteOwnSystemById(creator, system)

	return http.res.status(200).json({
		success: true,
		message: "Favorite System has been retrieved.",
		data: {
			favorite,
		},
	})
})

export const getDeletedPersonalSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = personalSystemQuerySchema.parse(http.req.query)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	const { deleted, total } = await getDeletedOwnSystems(query, creator)

	return sendPaginatedResponse(http, { data: deleted, total }, query, "Personal Systems retrieved successfully")
})

export const softDeletePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	await softDeleteOwnSystem(system, creator)

	return http.res.status(404).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})

export const hardDeletePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)
	const creator = creatorIdentifierSchema.parse(http.req.user)

	await hardDeleteOwnSystem(system, creator)

	return http.res.status(410).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})
