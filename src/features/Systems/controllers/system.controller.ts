import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared"
import { createCompanySystem, updateCompanySystem } from "@/features/Systems/services/system.service"
import { createSystemSchema, creatorIdentifierSchema, systemIdentifierSchema, updateSystemSchema } from "@/schema"
import { logger } from "@/lib"

export const createCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	logger.info("Http Request Session: ", http.req.user)
	const creator = creatorIdentifierSchema.parse( http.req.user)
	logger.info("Parsing id passed: ", creator)
	const body = createSystemSchema.parse(http.req.body)

	const systemCreated = await createCompanySystem(creator, body)

	return http.res.status(201).json({
		success: true,
		message: "System has been created.",
		data: {
			id: systemCreated,
		},
	})
})

export const updateCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const system = systemIdentifierSchema.parse(http.req.params)
	const body = updateSystemSchema.parse(http.req.body)

	const systemUpdated = await updateCompanySystem(system, body)

	return http.res.status(201).json({
		success: true,
		message: "System has been updated.",
		data: {
			id: systemUpdated,
		},
	})
})
