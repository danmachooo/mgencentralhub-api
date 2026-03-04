import { isPrismaKnownRequestError } from "@/helpers/prisma/is-prisma-known-request-error.helper"
import { prismaToAppError } from "@/helpers/prisma/prisma-to-app-error.helper"

export async function withPrismaErrorHandling<T>(
	fn: () => Promise<T>,
	opts: Parameters<typeof prismaToAppError>[1]
): Promise<T> {
	try {
		return await fn()
	} catch (err) {
		if (isPrismaKnownRequestError(err)) {
			throw prismaToAppError(err, opts)
		}
		throw err
	}
}
