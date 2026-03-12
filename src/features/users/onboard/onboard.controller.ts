import { onBoardOrchestrator } from "@/features/users/onboard/onboard.service"
import { sendResponse } from "@/helpers/shared/send-response.helper"
import { asyncHandler } from "@/middlewares"
import { userIdentifierSchema } from "@/schema"
import type { HttpContext } from "@/types/shared"

export const setOnboardStatusController = asyncHandler(async (http: HttpContext) => {
	const user = userIdentifierSchema.parse(http.req.user)

	const onboarded = await onBoardOrchestrator("set", user)

	return sendResponse(http.res, true, 200, "User has been onboarded", onboarded)
})

export const getOnboardStatusController = asyncHandler(async (http: HttpContext) => {
	const user = userIdentifierSchema.parse(http.req.user)

	const onboarded = await onBoardOrchestrator("get", user)

	return sendResponse(http.res, true, 200, "User's onboard status has been fetched.", onboarded)
})
