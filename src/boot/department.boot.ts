import { PrismaErrorHandler } from "@/helpers/prisma"
import { CreateManyDepartmentInput } from "@/schema"
import { logger, prisma } from "@/lib"
import { createManyDepartments } from "@/features/Departments/department.repo"

const bootDepartmentErrors = new PrismaErrorHandler({
	entity: "Roles",
})

export async function createDepartments() {
	const result = await prisma.department.findMany({
		select: {
			id: true,
		},
	})

	if (result.length > 0) {
        logger.info("There are already departments available, Skipping ...")
        return
    }

	const departments: CreateManyDepartmentInput = [
		{
			name: "Software Development",
            description : "Department that is focused on making softwares and digital innovations."
		},
		{
			name: "HR",
			description: "Department that is responsible for managing employees.",
		},
	]

    logger.info("Initializing departments ...")
	await bootDepartmentErrors.exec(() => createManyDepartments(departments))
    logger.info("Department has been initialized! :)")
}
