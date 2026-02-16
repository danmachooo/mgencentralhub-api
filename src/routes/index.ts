import { Router } from "express"
import HealthRouter from "./health.route"
import SystemRouter from "./Systems/system.route"

const router = Router()

// Use to check health route
router.use("/health", HealthRouter)

router.use("/system", SystemRouter)

export default router
