import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { appConfig } from "@/config/appConfig"
import { s3Client } from "@/lib"

const MIME_TO_EXT: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/webp": ".webp",
	"image/svg+xml": ".svg",
}

function buildStorageKey(folder: string, mimetype: string): string {
	const ext = MIME_TO_EXT[mimetype] ?? ".bin"
	return `${folder}/${randomUUID()}${ext}`
}

const isSupabase = appConfig.storage.mode === "supabase"

// ─── Upload ────────────────────────────────────────────────────────────────

export async function uploadFile(file: Express.Multer.File, folder: string = "systems"): Promise<string> {
	const key = buildStorageKey(folder, file.mimetype)

	if (isSupabase) {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: appConfig.storage.bucket,
				Key: key,
				Body: file.buffer,
				ContentType: file.mimetype,
			})
		)
	} else {
		const fullPath = path.join(appConfig.storage.uploadDir, key)
		await fs.mkdir(path.dirname(fullPath), { recursive: true })
		await fs.writeFile(fullPath, file.buffer)
	}

	return key
}

// ─── Delete (best-effort, non-blocking) ───────────────────────────────────

export async function deleteFile(key: string | null | undefined): Promise<void> {
	if (!key) return

	try {
		if (isSupabase) {
			await s3Client.send(
				new DeleteObjectCommand({
					Bucket: appConfig.storage.bucket,
					Key: key,
				})
			)
		} else {
			const fullPath = path.join(appConfig.storage.uploadDir, key)
			await fs.unlink(fullPath)
		}
	} catch (err) {
		console.warn(`[storage] Failed to delete file (${key}):`, err)
	}
}

// ─── Resolve key → URL ────────────────────────────────────────────────────

export async function resolveFileUrl(key: string | null | undefined): Promise<string | null> {
	if (!key) return null

	if (isSupabase) {
		const url = await getSignedUrl(
			s3Client,
			new GetObjectCommand({
				Bucket: appConfig.storage.bucket,
				Key: key,
			}),
			{ expiresIn: 60 * 60 } // 1 hour
		)
		return url
	}

	const normalized = key.replace(/\\/g, "/")
	return `${appConfig.storage.baseUrl}/uploads/${normalized}`
}
