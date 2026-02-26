import { getSessionHandler, signInHandler, signUpHandler } from "@/features/Auth-test/auth"
import { getCompanyDepartmentsHandler } from "@/features/Departments/department.controller"
import { getActiveUserRolesHandler } from "@/features/Users/Role/role.controller"
import { Router } from "express"

const router = Router()

router.post("/sign-in", signInHandler)
router.post("/sign-up", signUpHandler)
router.get("/get-session", getSessionHandler)
router.get("/departments", getCompanyDepartmentsHandler)
router.get("/roles", getActiveUserRolesHandler)
// router.get("/get-access-token", getAccessToken)

export default router
