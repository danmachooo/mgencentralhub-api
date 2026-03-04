import { getSessionHandler, signInHandler, signUpHandler } from "@/features/auth-test/auth"
import { getCompanyDepartmentsHandler } from "@/features/departments/department.controller"
import { getActiveUserRolesHandler } from "@/features/users/role/role.controller"
import { rateLimit } from "@/middlewares"
import { Router } from "express"

const router = Router()

router.post(
	"/sign-in",
	rateLimit({
		windowMs: 60 * 1000,
		max: 8,
		message: "Too many sign-in attempts. Please try again in a minute.",
		keyPrefix: "auth-test:sign-in",
		identity: "ip",
		blockDurationMs: 10 * 60 * 1000,
	}),
	signInHandler
)

router.post(
	"/sign-up",
	rateLimit({
		windowMs: 10 * 60 * 1000,
		max: 5,
		message: "Too many sign-up attempts. Please try again later.",
		keyPrefix: "auth-test:sign-up",
		identity: "ip",
		blockDurationMs: 30 * 60 * 1000,
	}),
	signUpHandler
)

router.get(
	"/get-session",
	rateLimit({
		windowMs: 60 * 1000,
		max: 30,
		message: "Too many session checks. Please slow down.",
		keyPrefix: "auth-test:get-session",
		identity: "ip",
	}),
	getSessionHandler
)

router.get("/departments", getCompanyDepartmentsHandler)
router.get("/roles", getActiveUserRolesHandler)

export default router
