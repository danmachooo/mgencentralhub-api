import { ListObjectsV2Command, DeleteObjectsCommand, type ListObjectsV2CommandOutput } from "@aws-sdk/client-s3"
import { appConfig } from "../src/config/appConfig"
import { s3Client } from "../src/lib/supabase"
import fs from "fs/promises"
import { logger } from "../src/lib/logger"

const BUCKET = appConfig.storage.bucket

async function clearLocal() {
	const dir = appConfig.storage.uploadDir

	await fs.rm(dir, {
		recursive: true,
		force: true,
	})

	await fs.mkdir(dir, {
		recursive: true,
	})
	logger.info(`Local upload folder cleared : ${dir}`)
}

async function clearBucket() {
	if (appConfig.app.nodeEnv === "production") {
		logger.error("Refusing to clear bucket in production.")
		process.exit(1)
	}

	console.log(`Clearing bucket: ${BUCKET}`)

	let cleared = 0
	let continuationToken: string | undefined = undefined

	// S3 deleteObjects maxes at 1000 per call — loop until empty
	do {
		const listed: ListObjectsV2CommandOutput = await s3Client.send(
			new ListObjectsV2Command({
				Bucket: BUCKET,
				ContinuationToken: continuationToken,
			})
		)

		const objects = listed.Contents ?? []
		if (objects.length === 0) break

		await s3Client.send(
			new DeleteObjectsCommand({
				Bucket: BUCKET,
				Delete: {
					Objects: objects.map(({ Key }) => ({ Key: Key })),
					Quiet: true,
				},
			})
		)

		cleared += objects.length
		continuationToken = listed.NextContinuationToken
		logger.info(`Deleted ${cleared} file(s)...`)
	} while (continuationToken)

	logger.info(`Bucket cleared. Total deleted: ${cleared}`)
}

async function clearStorage() {
	if (appConfig.storage.mode === "supabase") {
		await clearBucket()
	} else {
		await clearLocal()
	}
}

void clearStorage()
