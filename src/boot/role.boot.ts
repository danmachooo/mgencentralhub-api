import { createManyRoles } from "@/features/UserRole/userRole.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { CreateManyRoleInput } from "@/schema"
import { logger, prisma } from "@/lib"

const bootRoleErrors = new PrismaErrorHandler({
	entity: "Roles",
})

export async function createRoles() {
	const result = await prisma.role.findMany({
		select: {
			id: true,
		},
	})

	if (result.length > 0) {
        logger.info("There are already roles available, Skipping ...")
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

    logger.info("Initializing user roles ...")
	await bootRoleErrors.exec(() => createManyRoles(roles))
    logger.info("User roles has been initialized! :)")
}
