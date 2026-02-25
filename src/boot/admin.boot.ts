import { createUser } from "@/features/UserProfiles/userProfile.service"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { auth, logger, prisma } from "@/lib"
import { APIError } from "better-auth/*"

const adminBootErrors = new PrismaErrorHandler({
    entity: "User Profile"
})

export async function createAdmin() {
	const result = await adminBootErrors.exec(() => prisma.userProfile.findMany({
		select: { userId: true },
		where: { role: { name: "ADMIN" } },
	}))

	if (result.length <= 0) {
		logger.info("There are already users in the db. Skipping ...")
		return
	}

	const adminRole = await adminBootErrors.exec(() => prisma.role.findFirst({
		where: {
			name: "ADMIN",
		},
		select: {
			id: true,
		},
	}))

	if (!adminRole) {
		logger.info("There are no roles available. Skipping ...")
		return
	}

	const department = await adminBootErrors.exec(() => prisma.department.findFirst({
		where: {
			name: "Software Development",
		},
		select: {
			id: true,
		},
	}))

	if (!department) {
		logger.info("There are no departments available. Skipping")
		return
	}

	const userInfo = {
		name: "Super Idol",
		email: "johnpauldanmachi@gmail.com",
		password: "mgen@admin123",
		roleId: adminRole?.id,
		departmentId: department?.id,
	}

	logger.info("Signing in with better-auth ...")

    let betterAuthUser;
    try {
        betterAuthUser = await auth.api.signInEmail({
            body: {
                email: userInfo.email,
                password: userInfo.password,
            },
        })
    } catch (error) {
        if(error instanceof APIError){
            logger.error("Signing in failed. :(")

        }
        throw error
    }


    logger.info("Signing in complete! :)")

	const data = {
		id: betterAuthUser?.user.id,
		roleId: userInfo.roleId,
		departmentId: userInfo.departmentId,
	}

    logger.info("User creation in progress ...")

	await adminBootErrors.exec(() =>  createUser(data))

	logger.info("Initial user has been created.", userInfo)
}
