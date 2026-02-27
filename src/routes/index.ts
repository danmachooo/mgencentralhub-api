import { Router } from "express"
import HealthRouter from "@/routes/health.route"
import SystemRouter from "@/routes/Systems/system.route"
import DepartmentRouter from "@/routes/Departments/department.route"
import AuthTestRouter from "@/routes/AuthTest/authTest.route"
import UserRouter from "@/routes/Users/userProfile.route"
import RoleRouter from "@/routes/Roles/role.route"
import { requireAuth } from "@/middlewares"
import { appConfig } from "@/config/appConfig"

const router = Router()

// Use to check health route
router.use("/health", HealthRouter)

if (appConfig.app.nodeEnv !== "production") {
	router.use("/auth-test", AuthTestRouter)
}
router.use("/systems", requireAuth, SystemRouter)
router.use("/departments", requireAuth, DepartmentRouter)
router.use("/users", requireAuth, UserRouter)
router.use("/roles", requireAuth, RoleRouter)

export default router
