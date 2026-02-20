import type { HttpContext } from "@/types/shared"
import type { PaginatedResult } from "@/types/shared/paginatedResult.type"

export function sendPaginatedResponse<T>(
	http: HttpContext,
	result: PaginatedResult<T>,
	query: { page: number; limit: number },
	message = "Data retrieved successfully"
) {
	return http.res.status(200).json({
		success: true,
		message,
		data: result.data,
		meta: {
			total: result.total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(result.total / query.limit),
			hasNextPage: query.page < Math.ceil(result.total / query.limit),
		},
	})
}
