import { getUsersHandler, updateUserHandler } from "@/features/Users/Profile/user-profile.controller"
import { requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

router.use(requireRole("ADMIN"))

router.get("/", getUsersHandler)
router.patch("/:id", updateUserHandler)

export default router
