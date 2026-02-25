import multer, { type FileFilterCallback } from "multer"
import type { Request } from "express"
import path from "path"

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"])

const MIME_TO_EXT: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/webp": ".webp",
	"image/svg+xml": ".svg",
}

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
	const mimeAllowed = ALLOWED_MIME_TYPES.has(file.mimetype)
	const ext = path.extname(file.originalname).toLowerCase()
	const expectedExt = MIME_TO_EXT[file.mimetype]

	// Reject if MIME not allowed, or extension doesn't match declared MIME
	const extMatches = file.mimetype === "image/jpeg" ? ext === ".jpg" || ext === ".jpeg" : ext === expectedExt

	if (!mimeAllowed || !extMatches) {
		return cb(new Error("Invalid file type. Allowed: PNG, JPG, WEBP, SVG."))
	}

	cb(null, true)
}

// Always memory storage — storage.service.ts decides where it lands
export const uploadMiddleware = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
	fileFilter,
})
