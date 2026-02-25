import { createManyPersonalSystem } from "@/features/Systems/PersonalSystems/personalSystem.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { prisma, logger } from "@/lib"
import { CreateManyPersonalSystemInput, CreateManySystemInput } from "@/schema"

const bootPersonalSystemErrors = new PrismaErrorHandler({
	entity: "Personal System",
})

const CREATOR_NAME = "Super Idol"

export async function createManyPersonalSystemBoot() {
	// Get an admin to be a creator reference
	const creator = await bootPersonalSystemErrors.exec(() =>
		prisma.userProfile.findFirst({
			where: {
				user: {
					name: CREATOR_NAME,
				},
			},
			select: {
				userId: true,
			},
		})
	)

	if (!creator) return

	const result = await bootPersonalSystemErrors.exec(() =>
		prisma.personalSystem.findMany({
			where: {
				ownerUserId: creator.userId,
			},
			select: {
				id: true,
			},
		})
	)

	if (result.length > 0) return

	const systems: CreateManyPersonalSystemInput = [
		{
			name: "Google",
			description:
				"Google is the world's leading search engine and technology giant, specializing in organizing the world’s information to make it universally accessible. It serves as the primary gateway to the internet, offering a massive ecosystem of tools including Search, Gmail, Maps, and Workspace.",
			url: "https://google.com",
		},
		{
			name: "YouTube",
			description:
				"YouTube is the world’s premier video-sharing platform and a massive search engine. It allows users to upload, view, and share content ranging from short-form clips to full-length documentaries, serving as a global hub for entertainment, education, and the creator economy.",
			url: "https://youtube.com",
		},
	]
	logger.info("Personal Company systems creation in progress ...")

	await bootPersonalSystemErrors.exec(() => createManyPersonalSystem(creator.userId, systems))
	logger.info("Personal Company systems has been created. :)")
}
