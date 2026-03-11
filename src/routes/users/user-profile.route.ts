import { createUserHandler, getUserProfileHandler, getUsersHandler, updateUserHandler } from "@/features/users/profile/user-profile.controller"
import { requireRole } from "@/middlewares"
import { Router } from "express"

import OnboardRouter from "@/routes/users/onboard.route"

const router = Router()


router.get("/", requireRole("ADMIN"),getUsersHandler)
router.post("/", createUserHandler)
router.patch("/:id",requireRole("ADMIN"), updateUserHandler)
router.get("/profile", getUserProfileHandler)


// Plug onboard router
router.use("/onboard", OnboardRouter)



export default router
