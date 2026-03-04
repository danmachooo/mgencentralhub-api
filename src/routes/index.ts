import { Router } from "express"
import HealthRouter from "@/routes/health.route"
import SystemRouter from "@/routes/systems/system.route"
import DepartmentRouter from "@/routes/departments/department.route"
import AuthTestRouter from "@/routes/auth-test/auth-test.route"
import UserRouter from "@/routes/users/user-profile.route"
import RoleRouter from "@/routes/roles/role.route"
import ChatbotRouter from "@/routes/chatbot/chatbot.route"
import { requireAuth } from "@/middlewares"
import { appConfig } from "@/config/app-config"

const router = Router()

// Use to check health route
router.use("/health", HealthRouter)

if (appConfig.app.nodeEnv === "development") {
	router.use("/auth-test", AuthTestRouter)
}

router.use("/systems", requireAuth, SystemRouter)
router.use("/departments", requireAuth, DepartmentRouter)
router.use("/users", requireAuth, UserRouter)
router.use("/roles", requireAuth, RoleRouter)
router.use("/chatbot", requireAuth, ChatbotRouter)

export default router
