import { createUser, getUserInfo, getUserProfile, updateUser } from "@/features/users/profile/user-profile.service"
import { sendPaginatedResponse } from "@/helpers/shared"
import { asyncHandler } from "@/middlewares"
import { CreateUserProfileInput, UserIdentifier, userIdentifierSchema, userProfileQuerySchema } from "@/schema"
import { updateUserProfileSchema } from "@/schema/users/profile/update-user-profile.schema"
import type { HttpContext } from "@/types/shared"

export const getUsersHandler = asyncHandler(async (http: HttpContext) => {
	const query = userProfileQuerySchema.parse(http.req.query)

	const { users, total } = await getUserInfo(query)

	return sendPaginatedResponse(http, { data: users, total }, query, "Users has been retrieved.")
})

export const createUserHandler = asyncHandler(async (http: HttpContext) => {
	const user: UserIdentifier = userIdentifierSchema.parse(http.req.user);


	const created = await createUser(user)

	return http.res.status(201).json({
		success: true,
		message: "User has been created.",
		data: created
	})
})

export const getUserProfileHandler = asyncHandler(async (http: HttpContext) => {
	const profile = await getUserProfile(http.req.user)
	return http.res.status(200).json({
		data: { profile },
		message: "User profile found.",
		success: true,
	})
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
