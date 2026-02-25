import { createManySystem } from "@/features/Systems/system.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { logger, prisma } from "@/lib"
import { CreateManySystemInput } from "@/schema"

const bootSystemErrors = new PrismaErrorHandler({
	entity: "System",
})

const ROLE_KEY = "ADMIN"
const NAME_FLAG_STATUS_KEY = "Active"
type DeptKeys = "hr" | "software development"

export async function createManySystemBoot() {
	// Check if there is already some systems
	const result = await bootSystemErrors.exec(() =>
		prisma.system.findMany({
			select: {
				id: true,
			},
		})
	)

	if (result.length > 0) return

	// Get an admin to be a creator reference
	const admin = await bootSystemErrors.exec(() =>
		prisma.userProfile.findFirst({
			where: {
				role: {
					name: ROLE_KEY,
				},
			},
			select: {
				userId: true,
			},
		})
	)

	if (!admin) return

	const status = await bootSystemErrors.exec(() =>
		prisma.systemFlag.findFirst({
			where: {
				name: NAME_FLAG_STATUS_KEY,
			},
			select: {
				id: true,
			},
		})
	)

	if (!status) return

	const departments = await bootSystemErrors.exec(() =>
		prisma.department.findMany({
			select: {
				id: true,
				name: true,
			},
		})
	)

	const department = departments.reduce(
		(acc, dept) => {
			const key = dept.name.toLowerCase() as DeptKeys
			acc[key] = dept.id
			return acc
		},
		{} as Record<DeptKeys, string>
	)

	const systems: CreateManySystemInput = [
		{
			name: "Mgenius",
			description: "An LMS built by the Microgenesis Software Development team",
			statusId: status.id,
			url: "https://mgenius.example.com",
			departmentIds: [department["software development"]].filter(Boolean),
		},
		{
			name: "Chronos",
			description: "A time tracker system built by the Microgenesis Software Development team",
			statusId: status.id,
			url: "https://chronos.example.com",
			departmentIds: [department["hr"], department["software development"]].filter(Boolean),
		},
	]

	logger.info("Company systems creation in progress ...")
	await bootSystemErrors.exec(() => createManySystem(admin.userId, systems))
	logger.info("Company systems has been created. :)")
}
