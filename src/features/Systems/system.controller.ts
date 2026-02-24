import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared"
import {
	createCompanySystem,
	getCompanySystems,
	getCompanySystemById,
	updateCompanySystem,
	getDeletedCompanySystems,
	restoreCompanySystem,
	softDeleteCompanySystem,
	hardDeleteCompanySystem,
	toggleFavoriteSystem,
	checkIfSystemIsFavorite,
	getFavoriteSystems,
	getFavoriteCompanySystemById,
} from "@/features/Systems/system.service"
import {
	createSystemSchema,
	creatorIdentifierSchema,
	systemIdentifierSchema,
	systemQuerySchema,
	updateSystemSchema,
} from "@/schema"
import { sendPaginatedResponse } from "@/helpers/shared"

export const createCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = createSystemSchema.parse(http.req.body)

	const systemCreated = await createCompanySystem(creator, body)

	return http.res.status(201).json({
		success: true,
		message: "System has been created.",
		data: {
			id: systemCreated.id,
		},
	})
})

export const updateCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = systemIdentifierSchema.parse(http.req.params)
	const body = updateSystemSchema.parse(http.req.body)

	const systemUpdated = await updateCompanySystem({ id }, body)

	return http.res.status(200).json({
		success: true,
		message: "System has been updated.",
		data: {
			id: systemUpdated,
		},
	})
})

export const toggleFavoriteSystemHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const { favorited } = await toggleFavoriteSystem(user, system)

	return http.res.status(200).json({
		success: true,
		message: favorited ? "Added to favorites." : "Removed from favorites",
	})
})

export const isFavoriteSystemHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const favorited = await checkIfSystemIsFavorite(user, system)

	return http.res.status(200).json({
		success: true,
		favorited,
	})
})

export const restoreCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	const restoredSystem = await restoreCompanySystem(system)

	return http.res.status(200).json({
		success: true,
		message: "System has been restored.",
		data: {
			restoredSystem,
		},
	})
})

export const softDeleteCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	await softDeleteCompanySystem(system)

	return http.res.status(404).json({
		success: true,
		message: "System has been deleted.",
	})
})

export const hardDeleteCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	await hardDeleteCompanySystem(system)

	return http.res.status(410).json({
		success: true,
		message: "System has been deleted.",
	})
})

export const getCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = systemQuerySchema.parse(http.req.query)

	const { systems, total } = await getCompanySystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Systems retrieved successfully")
})

export const getFavoriteCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const query = systemQuerySchema.parse(http.req.query)

	const { favoriteSystems, total } = await getFavoriteSystems(user, query)

	return sendPaginatedResponse(
		http,
		{ data: favoriteSystems, total },
		query,
		"Favorite Systems retrieved successfully"
	)
})

export const getCompanySystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = systemIdentifierSchema.parse(http.req.params)

	const system = await getCompanySystemById({ id })

	return http.res.status(200).json({
		success: true,
		message: "System has been retrieved.",
		data: {
			system,
		},
	})
})

export const getFavoriteCompanySystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const favorite = await getFavoriteCompanySystemById(user, system)

	return http.res.status(200).json({
		success: true,
		message: "Favorite System has been retrieved.",
		data: {
			favorite,
		},
	})
})

export const getDeletedCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = systemQuerySchema.parse(http.req.query)

	const { systems, total } = await getDeletedCompanySystems(query)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Systems retrieved successfully")
})
