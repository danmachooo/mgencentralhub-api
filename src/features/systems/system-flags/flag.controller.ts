import {
	createFlag,
	createManyFlags,
	getActiveSystemFlagById,
	getActiveSystemFlags,
	getInactiveSystemFlags,
	hardDeleteFlag,
	restoreFlag,
	softDeleteFlag,
	updateFlag,
} from "@/features/systems/system-flags/flag.service"
import { sendResponse } from "@/helpers/shared/send-response.helper"
import { asyncHandler } from "@/middlewares"
import { createSystemFlagSchema, systemFlagIdentifierSchema, updateSystemFlagSchema } from "@/schema"
import { createManySystemFlagSchema } from "@/schema/systems/system-flag/create-many-system-flag.schema"
import type { HttpContext } from "@/types/shared"

export const createSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const systemFlag = createSystemFlagSchema.parse(http.req.body)

	const systemFlagCreated = await createFlag(systemFlag)

	return sendResponse(http.res, true, 201, "A new system flag has been created.", { systemFlagCreated })
})

export const createManySystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const systemFlags = createManySystemFlagSchema.parse(http.req.body)

	const systemFlagsCreated = await createManyFlags(systemFlags)

	return sendResponse(http.res, true, 201, "New systems flags has been created.", { systemFlagsCreated })
})

export const updateSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)
	const systemFlag = updateSystemFlagSchema.parse(http.req.body)

	const systemFlagUpdated = await updateFlag(flag, systemFlag)

	return sendResponse(http.res, true, 200, "System flag has been updated.", { systemFlagUpdated })
})

export const softDeleteSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	await softDeleteFlag(flag)

	return sendResponse(http.res, true, 200, "A system flag has been deleted.")
})

export const hardDeleteSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	await hardDeleteFlag(flag)

	return sendResponse(http.res, true, 200, "A system flag has been permanently deleted.")
})

export const restoreSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	const restoredFlag = await restoreFlag(flag)

	return sendResponse(http.res, true, 200, "A system flag has been restored.", restoredFlag)
})

export const getActiveSystemFlagsHandler = asyncHandler(async (http: HttpContext) => {
	const { flags, total } = await getActiveSystemFlags()

	return sendResponse(http.res, true, 200, "Active flags has been retrieved.", { flags, total })
})

export const getActiveSystemFlagsByIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = systemFlagIdentifierSchema.parse(http.req.params)
	const flag = await getActiveSystemFlagById({ id })

	return sendResponse(http.res, true, 200, "Active flag has been retrieved.", { flag })
})

export const getInActiveSystemFlagsHandler = asyncHandler(async (http: HttpContext) => {
	const flag = await getInactiveSystemFlags()

	return sendResponse(http.res, true, 200, "Inactive flag has been retrieved.", { flag })
})
