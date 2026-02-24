import { isPrismaKnownRequestError, prismaToAppError } from "@/helpers/prisma"

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