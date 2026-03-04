import { createUser } from "@/features/Users/profile/user-profile.service"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { auth, logger, prisma } from "@/lib"
import { APIError } from "better-auth/api"
import { appConfig } from "@/config/app-config"

const adminBootErrors = new PrismaErrorHandler({
	entity: "User Profile",
})

export async function createAdminBoot() {
	const adminConfig = appConfig.bootstrap.admin
	if (!adminConfig.name || !adminConfig.email || !adminConfig.password) {
		logger.warn("Bootstrap admin config is incomplete. Skipping admin bootstrap.")
		return
	}

	const result = await adminBootErrors.exec(() =>
		prisma.userProfile.findMany({
			select: { userId: true },
			where: { role: { name: adminConfig.roleName } },
		})
	)

	if (result.length > 0) {
		return
	}

	const adminRole = await adminBootErrors.exec(() =>
		prisma.role.findFirst({
			where: {
				name: adminConfig.roleName,
			},
			select: {
				id: true,
			},
		})
	)

	if (!adminRole) {
		logger.info("There are no roles available. Skipping ...")
		return
	}

	const department = await adminBootErrors.exec(() =>
		prisma.department.findFirst({
			where: {
				name: adminConfig.departmentName,
			},
			select: {
				id: true,
			},
		})
	)

	if (!department) {
		logger.info("There are no departments available. Skipping")
		return
	}

	const userInfo = {
		name: adminConfig.name,
		email: adminConfig.email,
		password: adminConfig.password,
		roleId: adminRole.id,
		departmentId: department.id,
	}

	logger.info("Signing in with better-auth ...")

	let betterAuthUser
	try {
		betterAuthUser = await auth.api.signUpEmail({
			body: {
				name: userInfo.name,
				email: userInfo.email,
				password: userInfo.password,
			},
		})
	} catch (error) {
		if (error instanceof APIError) {
			logger.error("Signing in failed. :(")
		}
		throw error
	}

	logger.info("Signing in complete! :)")

	const data = {
		id: betterAuthUser.user.id,
		roleId: userInfo.roleId,
		departmentId: userInfo.departmentId,
	}

	logger.info("User creation in progress ...")

	await adminBootErrors.exec(() => createUser(data))

	logger.info("Initial bootstrap admin user has been created.")
}
