import { auth } from "@/lib/auth"
import { asyncHandler } from "@/middlewares/async-handler.middleware"
import type { HttpContext } from "@/types/shared"
import { AppError, UnauthorizedError } from "@/errors"
import { createUser, getUserAccessContext } from "@/features/users/profile/user-profile.service"
import { fromNodeHeaders } from "better-auth/node"

/**
 * Authentication middleware that enforces a valid user session.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 *
 * @returns A JSON 401 response if unauthorized, otherwise calls `next()`.
 */
export const requireAuth = asyncHandler(async (http: HttpContext) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(http.req.headers),
	})

	if (!session?.user) {
		throw new UnauthorizedError("User is unauthorized.")
	}

	const userContext = await getUserAccessContext(session.user)

	if (!userContext.profile) {
		const newProfile = await createUser({ id: userContext.id })
		userContext.profile = newProfile
	}

	const profile = userContext.profile

	if (!profile) {
		throw new AppError(500, "Failed to initialize user profile context")
	}

	// Attach full user (userId, role, department) for downstream use
	http.req.user = {
		id: userContext.id,
		role: {
			id: profile.roleId,
			name: profile.role.name,
		},
		department: userContext.profile?.department
			? {
					id: userContext.profile.departmentId as string,
					name: userContext.profile.department.name,
				}
			: null,
	}
	http.next()
})
