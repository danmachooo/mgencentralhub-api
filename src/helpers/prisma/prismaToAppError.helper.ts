import type { Prisma } from "@prisma/client"
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/errors"

type PrismaErrorOptions = {
	entity?: string
	uniqueFieldLabels?: Record<string, string>
	notFoundMessage?: string
	uniqueConstraintToField?: Record<string, string>
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null
}

function getNested(meta: unknown, path: string[]): unknown {
	let cur: unknown = meta
	for (const key of path) {
		if (!isRecord(cur)) return undefined
		cur = cur[key]
	}
	return cur
}

function getString(meta: unknown, path: string[]): string | undefined {
	const v = getNested(meta, path)
	return typeof v === "string" ? v : undefined
}

function getConstraintNameFromAdapterMeta(meta: unknown): string | undefined {
	const fromConstraint = getString(meta, ["driverAdapterError", "cause", "constraint", "name"])
	if (fromConstraint) return fromConstraint

	const originalMessage = getString(meta, ["driverAdapterError", "cause", "originalMessage"])
	const fromMessage = originalMessage?.match(/unique constraint "([^"]+)"/)?.[1]

	return fromMessage
}

function normalizeTargetToFields(target: unknown): string[] {
	if (Array.isArray(target)) return target.map(String)
	if (typeof target === "string") return [target]
	if (target != null && (typeof target === "number" || typeof target === "boolean")) return [String(target)]
	return []
}

export function prismaToAppError(err: Prisma.PrismaClientKnownRequestError, opts?: PrismaErrorOptions): AppError {
	const entity = opts?.entity
	console.log("Options: ", opts)
	const labels = opts?.uniqueFieldLabels ?? {}
	const constraintToField = opts?.uniqueConstraintToField ?? {}

	switch (err.code) {
		case "P2002": {
			// 1) Try Prisma's meta.target first
			const target = (err.meta as unknown as { target?: unknown } | undefined)?.target
			let fields = normalizeTargetToFields(target)

			// Optional: if you want friendly labels instead of raw field names:
			fields = fields.map(f => labels[f] ?? f)

			// 2) adapter-pg fallback: infer field from constraint name/message
			if (fields.length === 0) {
				const constraint = getConstraintNameFromAdapterMeta(err.meta)

				// user mapping
				const mappedField = constraint ? constraintToField[constraint] : undefined

				// best-effort inference
				const inferredField =
					mappedField ??
					(constraint?.includes("_url_") || constraint?.endsWith("_url_key")
						? "url"
						: constraint?.includes("_name_") || constraint?.endsWith("_name_key")
							? "name"
							: undefined)

				if (inferredField) fields = [inferredField]
			}

			const msg = entity ? `${entity} already exists` : "Resource already exists"
			return new ConflictError(msg, fields.length ? { fields } : undefined)
		}

		case "P2025":
			return new NotFoundError(opts?.notFoundMessage ?? (entity ? `${entity} not found` : "Record not found"))

		case "P2003":
			return new ValidationError(
				entity ? `Invalid reference while saving ${entity}` : "Invalid reference: related record does not exist"
			)

		case "P2014":
			return new ValidationError(
				entity
					? `Operation violates a required relation for ${entity}`
					: "Operation violates a required relation"
			)

		default:
			return new AppError(500, "Database error occurred")
	}
}
