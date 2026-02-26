import { createManyRoles } from "@/features/Users/Role/role.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type { CreateManyRoleInput } from "@/schema"
import { logger, prisma } from "@/lib"

const bootRoleErrors = new PrismaErrorHandler({
	entity: "Roles",
})

export async function createManyRolesBoot() {
	const result = await prisma.role.findMany({
		select: {
			id: true,
		},
	})

	if (result.length > 0) {
		return
	}

	const roles: CreateManyRoleInput = [
		{
			name: "ADMIN",
			description: "Role that has an administrator access.",
		},
		{
			name: "EMPLOYEE",
			description: "Role that has only limited department-scoped access.",
		},
	]

	logger.info("Company roles creation in progress ...")
	await bootRoleErrors.exec(() => createManyRoles(roles))
	logger.info("Company roles has been created. :)")
}
