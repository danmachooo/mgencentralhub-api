import { prisma } from "@/lib/prisma"; 
import { UserIdentifier } from "@/schema";

export async function getUserContext(user: UserIdentifier) {
    return prisma.userProfile.findUnique({
        where: {
            userId: user.id
        },
        select: {
            role: true, 
            departmentId: true
        }
    })
}