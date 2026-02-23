import { isPrismaKnownRequestError, prismaToAppError } from "@/helpers/prisma"

type PrismaToAppErrorOpts = Parameters<typeof prismaToAppError>[1]

export class PrismaErrorHandler {
	private readonly baseOpts: PrismaToAppErrorOpts

	constructor(baseOpts: PrismaToAppErrorOpts) {
		this.baseOpts = baseOpts
	}

	/**
	 * Execute a prisma operation and convert known Prisma errors to AppError.
	 * You can optionally override/extend options per call.
	 */
	async exec<T>(fn: () => Promise<T>, overrideOpts?: PrismaToAppErrorOpts): Promise<T> {
		try {
			return await fn()
		} catch (err) {
			if (isPrismaKnownRequestError(err)) {
				// Merge base + overrides (override wins)
				const merged = { ...(this.baseOpts ?? {}), ...(overrideOpts ?? {}) }
				throw prismaToAppError(err, merged)
			}
			throw err
		}
	}
}
