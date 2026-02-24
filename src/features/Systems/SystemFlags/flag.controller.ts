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
} from "@/features/Systems/SystemFlags/flag.service"
import { asyncHandler } from "@/middlewares"
import { createSystemFlagSchema, systemFlagIdentifierSchema, updateSystemFlagSchema } from "@/schema"
import { createManySystemFlagSchema } from "@/schema/Systems/SystemFlag/createManySystemFlag.schema"
import type { HttpContext } from "@/types/shared"

export const createSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const systemFlag = createSystemFlagSchema.parse(http.req.body)

	const systemFlagCreated = await createFlag(systemFlag)

	return http.res.status(201).json({
		success: true,
		message: "A new system flag has been created.",
		data: {
			systemFlagCreated,
		},
	})
})

export const createManySystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const systemFlags = createManySystemFlagSchema.parse(http.req.body)

	const systemFlagsCreated = await createManyFlags(systemFlags)

	return http.res.status(201).json({
		success: true,
		message: "New systems flags has been created.",
		data: {
			systemFlagsCreated,
		},
	})
})

export const updateSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)
	const systemFlag = updateSystemFlagSchema.parse(http.req.body)

	const systemFlagUpdated = await updateFlag(flag, systemFlag)

	return http.res.status(200).json({
		success: true,
		message: "System flag has been updated.",
		data: {
			systemFlagUpdated,
		},
	})
})

export const softDeleteSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	await softDeleteFlag(flag)

	return http.res.status(404).json({
		success: true,
		message: "A system flag has been deleted.",
	})
})

export const hardDeleteSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	await hardDeleteFlag(flag)

	return http.res.status(410).json({
		success: true,
		message: "A system flag has been deleted.",
	})
})

export const restoreSystemFlagHandler = asyncHandler(async (http: HttpContext) => {
	const flag = systemFlagIdentifierSchema.parse(http.req.params)

	const restoredFlag = await restoreFlag(flag)

	return http.res.status(200).json({
		success: true,
		message: "A system flag has been restored.",
		data: restoredFlag,
	})
})

export const getActiveSystemFlagsHandler = asyncHandler(async (http: HttpContext) => {
	const { flags, total } = await getActiveSystemFlags()

	return http.res.status(200).json({
		success: true,
		message: "Active flags has been retrieved.",
		data: {
			flags,
			total,
		},
	})
})

export const getActiveSystemFlagsByIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = systemFlagIdentifierSchema.parse(http.req.params)
	const flag = await getActiveSystemFlagById({ id })

	return http.res.status(200).json({
		success: true,
		message: "Active flag has been retrieved.",
		data: {
			flag,
		},
	})
})

export const getInActiveSystemFlagsHandler = asyncHandler(async (http: HttpContext) => {
	const flag = await getInactiveSystemFlags()

	return http.res.status(200).json({
		success: true,
		message: "Active flag has been retrieved.",
		data: {
			flag,
		},
	})
})
