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
	createManyCompanySystems,
} from "@/features/systems/system.service"
import {
	createManySystemSchema,
	createSystemSchema,
	creatorIdentifierSchema,
	systemIdentifierSchema,
	systemQuerySchema,
	updateSystemSchema,
} from "@/schema"
import { sendPaginatedResponse } from "@/helpers/shared"
import { sendResponse } from "@/helpers/shared/send-response.helper"

export const createCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = createSystemSchema.parse(http.req.body)

	const file = http.req.file ?? null

	const systemCreated = await createCompanySystem(creator, body, file)

	return sendResponse(http.res, 201, "System has been created.", systemCreated)
})

export const createManyCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse(http.req.user)
	const body = createManySystemSchema.parse(http.req.body)

	const systemsCreated = await createManyCompanySystems(creator, body)

	return sendResponse(http.res, 201, "Systems has been created.", systemsCreated)
})

export const updateCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)
	const body = updateSystemSchema.parse(http.req.body)
	const file = http.req.file ?? null

	const systemUpdated = await updateCompanySystem(system, body, file)

	return sendResponse(http.res, 200, "System has been updated.", systemUpdated)
})

export const toggleFavoriteSystemHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const systemFavorite = await toggleFavoriteSystem(user, system)

	return sendResponse(
		http.res,
		200,
		systemFavorite.favorited ? "Added to favorites" : "Removed from favorites",
		systemFavorite
	)
})

export const isFavoriteSystemHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const favorited = await checkIfSystemIsFavorite(user, system)

	return sendResponse(http.res, 200, "System favorite status has been retrieved successfully.", {
		isFavorite: favorited,
	})
})

export const restoreCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	const { restored } = await restoreCompanySystem(system)

	return sendResponse(http.res, 200, "System has been restored.", restored)
})

export const softDeleteCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	const softDeleted = await softDeleteCompanySystem(system)

	return sendResponse(http.res, 200, "System has been deleted.", softDeleted)
})

export const hardDeleteCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)

	const hardDeleted = await hardDeleteCompanySystem(system)

	return sendResponse(http.res, 200, "System has been permanently deleted.", hardDeleted)
})

export const getCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = systemQuerySchema.parse(http.req.query)
	const { role, department } = http.req.user

	const departmentId = role?.name.toUpperCase() === "ADMIN" ? null : (department?.id ?? "NO_DEPARTMENT")

	const { systems, total } = await getCompanySystems(query, departmentId)

	return sendPaginatedResponse(http, { data: systems, total }, query, "Systems retrieved successfully")
})

export const getFavoriteCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const query = systemQuerySchema.parse(http.req.query)

	const { favorites, total } = await getFavoriteSystems(user, query)

	return sendPaginatedResponse(http, { data: favorites, total }, query, "Favorite Systems retrieved successfully")
})

export const getCompanySystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const systemParam = systemIdentifierSchema.parse(http.req.params)
	const { system } = await getCompanySystemById(systemParam)
	return sendResponse(http.res, 200, "System has been retrieved.", { system })
})

export const getFavoriteCompanySystemByIdHandler = asyncHandler(async (http: HttpContext) => {
	const user = creatorIdentifierSchema.parse(http.req.user)
	const system = systemIdentifierSchema.parse(http.req.params)

	const { favorite } = await getFavoriteCompanySystemById(user, system)

	return sendResponse(http.res, 200, "Favorite System has been retrieved.", { favorite })
})

export const getDeletedCompanySystemsHandler = asyncHandler(async (http: HttpContext) => {
	const query = systemQuerySchema.parse(http.req.query)

	const { deleted, total } = await getDeletedCompanySystems(query)

	return sendPaginatedResponse(http, { data: deleted, total }, query, "Systems retrieved successfully")
})
