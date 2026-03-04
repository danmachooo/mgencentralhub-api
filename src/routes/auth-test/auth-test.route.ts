import { getSessionHandler, signInHandler, signUpHandler } from "@/features/auth-test/auth"
import { getCompanyDepartmentsHandler } from "@/features/departments/department.controller"
import { getActiveUserRolesHandler } from "@/features/Users/role/role.controller"
import { Router } from "express"

const router = Router()

router.post("/sign-in", signInHandler)
router.post("/sign-up", signUpHandler)
router.get("/get-session", getSessionHandler)
router.get("/departments", getCompanyDepartmentsHandler)
router.get("/roles", getActiveUserRolesHandler)
// router.get("/get-access-token", getAccessToken)

export default router
