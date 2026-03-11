import { onBoardOrchestrator } from "@/features/users/onboard/onboard.service";
import { asyncHandler } from "@/middlewares";
import { userIdentifierSchema } from "@/schema";
import type { HttpContext } from "@/types/shared";


export const setOnboardStatusController = asyncHandler(async (http: HttpContext) => {
    const user = userIdentifierSchema.parse(http.req.body);

    const onboarded = await onBoardOrchestrator("set", user);

    return http.res.status(200).json({
        success: true,
        message: "User has been onboarded",
        data: onboarded
    })
})

export const getOnboardStatusController = asyncHandler(async (http: HttpContext) => {
    const user = userIdentifierSchema.parse(http.req.user);

    const onboarded = await onBoardOrchestrator("get", user);

    return http.res.status(200).json({
        success: true,
        message: "User's onboard status has been fetched.",
        data: onboarded
    })
})