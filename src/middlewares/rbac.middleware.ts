import { asyncHandler } from "@/middlewares/asyncHandler.middleware"
import type { HttpContext } from "@/types/shared"
import { ForbiddenError } from "@/errors"

type AllowedRole = "admin" | "employee"

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
		const userRole = http.req.user.role.name as AllowedRole

		if (!roles.includes(userRole)) {
			throw new ForbiddenError("You do not have permission to perform this action.")
		}

		http.next()
	})
