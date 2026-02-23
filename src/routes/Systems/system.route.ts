import {
	createCompanySystemHandler,
	getCompanySystemByIdHandler,
	getCompanySystemsHandler,
	hardDeleteCompanySystemHandler,
	restoreCompanySystemHandler,
	softDeleteCompanySystemHandler,
	updateCompanySystemHandler,
} from "@/features/Systems/system.controller"
import { getDeletedCompanySystems } from "@/features/Systems/system.service"
import { Router } from "express"

const router = Router()

router.get("/", getCompanySystemsHandler)
router.get("/", getDeletedCompanySystems)
router.get("/:id", getCompanySystemByIdHandler)

router.post("/", createCompanySystemHandler)

router.patch("/:id", restoreCompanySystemHandler)
router.patch("/:id", updateCompanySystemHandler)

router.delete("/:id", softDeleteCompanySystemHandler)
router.delete("/:id", hardDeleteCompanySystemHandler)

export default router
