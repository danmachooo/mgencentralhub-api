import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared"
import { createCompanySystem, updateCompanySystem } from "@/features/Systems/services/system.service"
import { createSystemSchema, creatorIdentifierSchema, systemIdentifierSchema, updateSystemSchema } from "@/schema"

export const createCompanySystemHandler = asyncHandler(async (http: HttpContext) => {
	const creator = creatorIdentifierSchema.parse( http.req.user)
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
