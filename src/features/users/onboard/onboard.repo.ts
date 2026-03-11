import { prisma } from "@/lib";

export async function updateOnboard(userId: string) {
    const onboarded = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            onboard: true
        },
        select: {
            onboard: true
        }
    })

    return {
        user: onboarded
    }
}

export async function getOnboard(userId: string) {
    const onboarded = await prisma.user.findFirstOrThrow({
        where: {
            id: userId
        },
        select: {
            onboard: true
        }
    })

    return {
        user: onboarded
    }
}