export type PaginationOptions = {
	take: number // The 'limit' from Zod
	skip: number // The calculated (page - 1) * limit
}
