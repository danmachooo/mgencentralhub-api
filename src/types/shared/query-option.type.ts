import type { PaginationOptions } from "@/types/shared"

// If you want to include sorting in the same object:
export type QueryOptions = PaginationOptions & {
	orderBy?: Record<string, "asc" | "desc">
}
