// src/boot/index.ts
import { createAdminBoot } from "@/boot/admin.boot"
import { createManySystemBoot } from "@/boot/companySystem.boot"
import { createDepartmentsBoot } from "@/boot/department.boot"
import { createManyPersonalSystemBoot } from "@/boot/personalSystems.boot"
import { createManyRolesBoot } from "@/boot/role.boot"
import { createManySystemFlagsBoot } from "@/boot/systemFlag.boot"
import { logger } from "@/lib"
import { appConfig } from "@/config/appConfig"

export const initializeModels = async () => {
	if (!appConfig.bootstrap.enabled) {
		logger.info("Bootstrap disabled. Skipping model initialization.")
		return
	}

	logger.info("Starting model initialization...")

	await Promise.all([createDepartmentsBoot(), createManyRolesBoot(), createManySystemFlagsBoot()])

	await createAdminBoot()

	await Promise.all([createManySystemBoot(), createManyPersonalSystemBoot()])

	logger.info("Model initialized successfully")
}
