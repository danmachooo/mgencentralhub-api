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
			systemCreated
		},
	})
})

export const updatePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)
	const body = updatePersonalSystemSchema.parse(http.req.body)
	const file = http.req.file ?? null

	const systemUpdated = await updateOwnSystem(system, body, file)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been updated.",
		data: {
			systemUpdated
		},
	})
})

export const toggleFavoritePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const { favorited } = await toggleFavoritePersonalSystem(user, system)

	return http.res.status(200).json({
		success: true,
		message: favorited ? "Added to favorites." : "Removed from favorites",
	})
})

export const restorePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
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

export const getPersonalSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = personalSystemQuerySchema.parse(http.req.query)

	const { systems, total } = await getOwnSystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Personal Systems retrieved successfully")
})
export const getFavoritePersonalSystemsHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const query = personalSystemQuerySchema.parse(http.req.query)

	const { favoriteSystems, total } = await getFavoriteOwnSystems(creator, query)

	return sendPaginatedResponse(
		http,
		{ data: favoriteSystems, total },
		query,
		"Favorite Personal Systems retrieved successfully"
	)
})

export const getPersonalSystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const _system = await getOwnSystemById(system)

	return http.res.status(200).json({
		success: true,
		message: "Personal System has been retrieved.",
		data: {
			_system,
		},
	})
})

export const getFavoritePersonalSystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	const favorite = await getFavoriteOwnSystemById(user, system)

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

	const { systems, total } = await getDeletedOwnSystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Personal Systems retrieved successfully")
})

export const softDeletePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	await softDeleteOwnSystem(system)

	return http.res.status(404).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})

export const hardDeletePersonalSystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = personalSystemIdentifierSchema.parse(http.req.params)

	await hardDeleteOwnSystem(system)

	return http.res.status(410).json({
		success: true,
		message: "Personal System has been deleted.",
	})
})
