import { Router } from "express"
import HealthRouter from "@/routes/health.route"
import SystemRouter from "@/routes/Systems/system.route"
import DepartmentRouter from "@/routes/Departments/department.route"
import AuthTestRouter from "@/routes/AuthTest/authTest.route"
import { requireAuth } from "@/middlewares"

const router = Router()

// Use to check health route
router.use("/health", HealthRouter)

router.use("/auth-test", AuthTestRouter)

router.use("/system", requireAuth, SystemRouter)
router.use("/department", DepartmentRouter)

export default router
