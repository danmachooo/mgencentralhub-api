import { Prisma } from "@prisma/client"

export function isPrismaKnownRequestError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
	return err instanceof Prisma.PrismaClientKnownRequestError
}
