// Add this to your types file
export type PrismaQueryOptions = {
	take: number
	skip: number
	orderBy?: Record<string, "asc" | "desc">
}
