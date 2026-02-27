import { getUsersHandler } from "@/features/Users/Profile/userProfile.controller"
import { requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

router.use(requireRole("ADMIN"))

router.get("/", getUsersHandler)

export default router
