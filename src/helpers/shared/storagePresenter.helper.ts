import { resolveFileUrl } from "@/features/Storage/storage.service"
/**
 * Takes any object with an `image` key field and resolves it to a URL.
 * Returns the object with image replaced by the resolved URL.
 */
export async function withResolvedImage<T extends { image: string | null }>(
	record: T
): Promise<T & { image: string | null }> {
	const imageUrl = await resolveFileUrl(record.image)
	return { ...record, image: imageUrl }
}

/**
 * Batch version for lists — resolves all images in parallel.
 */
export async function withResolvedImages<T extends { image: string | null }>(
	records: T[]
): Promise<(T & { image: string | null })[]> {
	return Promise.all(records.map(withResolvedImage))
}
