import { auth } from "@/lib/auth"
import { asyncHandler } from "@/middlewares/async-handler.middleware"
import type { HttpContext } from "@/types/shared"
import { UnauthorizedError } from "@/errors"
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
		headers: fromNodeHeaders(http.req.headers)
	})

	if (!session?.user) {
		throw new UnauthorizedError("User is unauthorized.")
	}

	let user = await getUserAccessContext(session.user)

	if (!user.profile) {
		await createUser({ id: user.id })
		user = await getUserAccessContext(session.user)
	}

	// Attach full user (userId, role, department) for downstream use
	http.req.user = {
		id: user.id,
		role: {
			id: user.profile!.roleId,
			name: user.profile!.role.name
		},
		department: user.profile?.department
			? {
				id: user.profile.departmentId as string,
				name: user.profile.department.name
			}
			: null
	}
	http.next()
})
