import { getUserInfo } from "@/features/UserProfiles/userProfile.service"
import { sendPaginatedResponse } from "@/helpers/shared"
import { asyncHandler } from "@/middlewares"
import { userProfileQuerySchema } from "@/schema"
import { HttpContext } from "@/types/shared"

export const getUsersHandler = asyncHandler(async (http: HttpContext) => {
	const query = userProfileQuerySchema.parse(http.req.query)

	const { users, total } = await getUserInfo(query)

	sendPaginatedResponse(http, { data: users, total }, query, "Users has been retrieved.")
})
