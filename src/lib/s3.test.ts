import { s3Client } from "@/lib/supabase"
import { logger } from '@/lib';
import { ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const TEST_BUCKET = "system-logos" // change to your actual bucket name
const TEST_KEY = "__connection-test/ping.txt"

async function testS3Connection() {
	logger.info("🔌 Testing S3 connection...\n")

	// ── 1. List buckets ───────────────────────────────────────────────────────
	try {
		const { Buckets } = await s3Client.send(new ListBucketsCommand({}))
		const names = Buckets?.map(b => b.Name).join(", ") ?? "none"
		logger.info(`Connected. Buckets found: ${names}`)
	} catch (err) {
		logger.error("Failed to list buckets:", err)
		process.exit(1) // no point continuing if credentials are wrong
	}

	// ── 2. List objects in your target bucket ─────────────────────────────────
	try {
		const { KeyCount } = await s3Client.send(new ListObjectsV2Command({ Bucket: TEST_BUCKET, MaxKeys: 5 }))
		logger.info(`Bucket "${TEST_BUCKET}" accessible. Objects (up to 5): ${KeyCount}`)
	} catch (err) {
		logger.error(`Cannot access bucket "${TEST_BUCKET}":`, err)
		process.exit(1)
	}

	// ── 3. Upload a test object ───────────────────────────────────────────────
	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: TEST_BUCKET,
				Key: TEST_KEY,
				Body: Buffer.from("connection-ok"),
				ContentType: "text/plain",
			})
		)
		logger.info(`Upload OK  → ${TEST_KEY}`)
	} catch (err) {
		logger.error("Upload failed:", err)
		process.exit(1)
	}

	// ── 4. Delete the test object (cleanup) ───────────────────────────────────
	try {
		await s3Client.send(new DeleteObjectCommand({ Bucket: TEST_BUCKET, Key: TEST_KEY }))
		logger.info(`Cleanup OK → ${TEST_KEY} deleted`)
	} catch (err) {
		// Non-fatal — bucket write works, cleanup just failed
		logger.warn("Cleanup failed (manual delete needed):", err)
	}

	logger.info("\All checks passed. S3 connection is healthy.")
}

void testS3Connection()
