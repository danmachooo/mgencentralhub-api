// src/boot/index.ts
import { createAdminBoot } from "@/boot/admin.boot"
import { createManySystemBoot } from "@/boot/companySystem.boot"
import { createDepartmentsBoot } from "@/boot/department.boot"
import { createManyPersonalSystemBoot } from "@/boot/personalSystems.boot"
import { createManyRolesBoot } from "@/boot/role.boot"
import { createManySystemFlagsBoot } from "@/boot/systemFlag.boot"
import { logger } from "@/lib"

export const initializeModels = async () => {
	try {
		logger.info("Starting model initialization...")

		await Promise.all([createDepartmentsBoot(), createManyRolesBoot(), createManySystemFlagsBoot()])

		await createAdminBoot()

		await Promise.all([createManySystemBoot(), createManyPersonalSystemBoot()])

		logger.info("Model initialized successfully")
	} catch (error) {
		logger.error("Initialization failed:", error)
		process.exit(1)
	}
}
