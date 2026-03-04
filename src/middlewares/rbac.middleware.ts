import { asyncHandler } from "@/middlewares/async-handler.middleware"
import type { HttpContext } from "@/types/shared"
import { ForbiddenError } from "@/errors"

type AllowedRole = "ADMIN" | "EMPLOYEE"

function isAllowedRole(role: string): role is AllowedRole {
	return role === "ADMIN" || role === "EMPLOYEE"
}

/**
 * Restricts access to the specified roles.
 * req.user must already be populated by requireAuth.
 *
 * Usage:
 *   router.post("/", requireAuth, requireRole("admin"), handler)
 *   router.get("/", requireAuth, requireRole("admin", "employee"), handler)
 */
export const requireRole = (...roles: AllowedRole[]) =>
	asyncHandler(async (http: HttpContext) => {
		const userRole = http.req.user.role.name.toUpperCase()

		if (!isAllowedRole(userRole) || !roles.includes(userRole)) {
			throw new ForbiddenError("You do not have permission to perform this action.")
		}

		http.next()
	})
