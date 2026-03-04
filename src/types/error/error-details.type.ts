import type { PrismaUniqueConstraintErrors } from "@/types/error"
import type { ZodErrors } from "@/types/error"

export type ErrorDetails = ZodErrors | PrismaUniqueConstraintErrors
