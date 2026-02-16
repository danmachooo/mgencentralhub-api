import {
	createDepartmentHandler,
	updateDepartmentHandler,
} from "@/features/Departments/controller/department.controller"
import { Router } from "express"

const router = Router()

router.post("/", createDepartmentHandler)
router.patch("/:id", updateDepartmentHandler)

export default router
