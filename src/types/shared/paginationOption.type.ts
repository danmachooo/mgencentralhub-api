export type PaginationOptions = {
	take: number // The 'limit' from Zod
	skip: number // The calculated (page - 1) * limit
}

// If you want to include sorting in the same object:
export type QueryOptions = PaginationOptions & {
	orderBy?: Record<string, "asc" | "desc">
}
