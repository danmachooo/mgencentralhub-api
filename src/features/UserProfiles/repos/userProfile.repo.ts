import { prisma } from "@/lib/prisma"
import type { UserIdentifier } from "@/schema"

export async function getUserContext(user: UserIdentifier) {
	return prisma.userProfile.findUnique({
		where: {
			userId: user.id,
		},
		select: {
			userId: true,
			role: true,
			departmentId: true,
		},
	})
}
