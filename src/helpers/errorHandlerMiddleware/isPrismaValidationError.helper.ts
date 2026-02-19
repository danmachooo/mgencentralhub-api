import { Prisma } from "@prisma/client"

export function isPrismaValidationError(err: Error): boolean {
	return err.name === "PrismaClientValidationError" || err instanceof Prisma.PrismaClientValidationError
}
