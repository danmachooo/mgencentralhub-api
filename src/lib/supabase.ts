import { appConfig } from "@/config/appConfig"
import { S3Client } from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
	forcePathStyle: true,
	region: appConfig.supabaseS3.region,
	endpoint: appConfig.supabaseS3.endpoint,
	credentials: {
		accessKeyId: appConfig.supabaseS3.credentials.accessKeyId,
		secretAccessKey: appConfig.supabaseS3.credentials.secretAccessKey,
	},
})
