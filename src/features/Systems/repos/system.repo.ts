import Logger from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import type { CreateSystemInput, UpdateSystemInput } from "@/schema"

export async function createSystem(id: string, data: CreateSystemInput) {
    Logger.info("I was here.")

    return 1

	// return prisma.$transaction(async tx => {
	// 	const systemCreated = await tx.system.create({
	// 		data: {
	// 			name: data.name,
	// 			description: data.description,
	// 			url: data.url,
	// 			image: data.image,
	// 			status: data.status,
	// 			creatorId: id,
	// 			departmentMap: {
	// 				create: data.departmentIds.map(departmentId => ({
	// 					departmentId,
	// 				})),
	// 			},
	// 		},
	// 		select: {
	// 			id: true,
	// 		},
	// 	})
	// 	return systemCreated
	// })
}

export async function updateSystem(id: string, data: UpdateSystemInput) {
    Logger.info("I was here.")
    return 1
	// return prisma.$transaction(async tx => {
	// 	const systemUpdated = await tx.system.update({
	// 		where: {
	// 			id: id,
	// 		},
	// 		data: {
	// 			name: data.name ?? undefined,
	// 			description: data.description ?? undefined,
	// 			url: data.url ?? undefined,
	// 			image: data.image ?? undefined,
	// 			status: data.status ?? undefined,
	// 		},
	// 		select: {
	// 			id: true,
	// 		},
	// 	})

	// 	if (data.departmentIds) {
	// 		await tx.systemDepartmentMap.deleteMany({
	// 			where: {
	// 				systemId: id,
	// 			},
	// 		})

	// 		if (data.departmentIds.length > 0) {
	// 			await tx.systemDepartmentMap.createMany({
	// 				data: data.departmentIds.map(departmentId => ({
	// 					systemId: id,
	// 					departmentId,
	// 				})),
	// 				skipDuplicates: true,
	// 			})
	// 		}
	// 	}

	// 	return systemUpdated
	// })
}

export async function listActiveCompanySystemsForAdmin() {
	return await prisma.system.findMany({
		where: {
			status: "ACTIVE",
		},
		select: {
			id: true,
			name: true,
			description: true,
			url: true,
			image: true,
		},
		orderBy: {
			name: "asc",
		},
	})
}

export async function listActiveCompanySystemsForDepartment(departmentId: string) {
	return await prisma.system.findMany({
		where: {
			status: "ACTIVE",
			departmentMap: {
				some: {
					departmentId,
				},
			},
		},
		select: {
			id: true,
			name: true,
			description: true,
			url: true,
			image: true,
		},
		orderBy: {
			name: "asc",
		},
	})
}
