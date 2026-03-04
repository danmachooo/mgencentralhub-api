// src/boot/index.ts
import { createAdminBoot } from "@/boot/admin.boot"
import { createManySystemBoot } from "@/boot/company-system.boot"
import { createDepartmentsBoot } from "@/boot/department.boot"
import { createManyPersonalSystemBoot } from "@/boot/personal-systems.boot"
import { createManyRolesBoot } from "@/boot/role.boot"
import { createManySystemFlagsBoot } from "@/boot/system-flag.boot"
import { logger } from "@/lib"
import { appConfig } from "@/config/app-config"

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
