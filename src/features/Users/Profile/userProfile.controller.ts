import { getUserInfo, updateUser } from "@/features/Users/Profile/userProfile.service"
import { sendPaginatedResponse } from "@/helpers/shared"
import { asyncHandler } from "@/middlewares"
import { userIdentifierSchema, userProfileQuerySchema } from "@/schema"
import { updateUserProfileSchema } from "@/schema/User/Profile/updateUserProfile.schema"
import type { HttpContext } from "@/types/shared"

export const getUsersHandler = asyncHandler(async (http: HttpContext) => {
	const query = userProfileQuerySchema.parse(http.req.query)

	const { users, total } = await getUserInfo(query)

	sendPaginatedResponse(http, { data: users, total }, query, "Users has been retrieved.")
})

export const updateUserHandler = asyncHandler(async (http: HttpContext) => {
	const body = updateUserProfileSchema.parse(http.req.body)
	const user = userIdentifierSchema.parse(http.req.params)

	const updatedUser = await updateUser(user, body)

	return http.res.status(200).json({
		success: true,
		message: "User profile has been updated.",
		data: {
			updatedUser,
		},
	})
})
