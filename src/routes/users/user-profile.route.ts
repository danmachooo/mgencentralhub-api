import { getUserProfileHandler, getUsersHandler, updateUserHandler } from "@/features/users/profile/user-profile.controller"
import { requireRole } from "@/middlewares"
import { Router } from "express"

import OnboardRouter from "@/routes/users/onboard.route"

const router = Router()

router.use(requireRole("ADMIN"))

router.get("/", getUsersHandler)
router.patch("/:id", updateUserHandler)
router.get("/profile", getUserProfileHandler)


// Plug onboard router
router.use("/onboard", OnboardRouter)



export default router
