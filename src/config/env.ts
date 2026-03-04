import "dotenv/config"
import { z } from "zod"

const envSchema = z
	.object({
		// SERVER
		PORT: z.coerce.number().default(8000),
		BASE_URL: z.string().min(1),

		// ENVIRONMENT
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
		ENABLE_BOOTSTRAP: z.coerce.boolean().default(false),

		// NEON (CLOUD)
		DATABASE_URL: z.string().min(1),

		// FRONTEND
		FRONTEND_URL: z.string().min(1),

		// BETTER AUTH
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().min(1),

		// AZURE SSO
		AZURE_AD_CLIENT_ID: z.string().min(1),
		AZURE_AD_CLIENT_SECRET: z.string().min(1),
		AZURE_AD_TENANT_ID: z.string().min(1),
		AZURE_AD_REDIRECT_URI: z.string().min(1),

		// GOOGLE SSO
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),

		//SUPABASE S3
		SUPABASE_URL: z.string().min(1),
		SUPABASE_ENDPOINT: z.string().min(1),
		SUPABASE_REGION: z.string().min(1),
		SUPABASE_BUCKET: z.string().min(1),
		SUPABASE_ACCESS_KEY_ID: z.string().min(1),
		SUPABASE_SECRET_ACCESS_KEY: z.string().min(1),

		// FILE UPLOAD
		STORAGE_MODE: z.enum(["local", "supabase"]).default("local"),
		LOCAL_UPLOAD_DIR: z.string().min(1),

		// Gemini
		GEMINI_API_KEY: z.string().min(1),
		GEMINI_MODEL: z.string().min(1),

		// Bootstrap
		BOOTSTRAP_ADMIN_NAME: z.string().min(1).optional(),
		BOOTSTRAP_ADMIN_EMAIL: z.email().optional(),
		BOOTSTRAP_ADMIN_PASSWORD: z.string().min(12).optional(),
		BOOTSTRAP_ADMIN_ROLE_NAME: z.string().min(1).default("ADMIN"),
		BOOTSTRAP_ADMIN_DEPARTMENT_NAME: z.string().min(1).default("Software Development"),

		// Redis
		UPSTASH_REDIS_REST_URL: z.string().min(1),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	})
	.superRefine((val, ctx) => {
		if (!val.ENABLE_BOOTSTRAP) return

		if (!val.BOOTSTRAP_ADMIN_NAME) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["BOOTSTRAP_ADMIN_NAME"],
				message: "Required when ENABLE_BOOTSTRAP is true",
			})
		}

		if (!val.BOOTSTRAP_ADMIN_EMAIL) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["BOOTSTRAP_ADMIN_EMAIL"],
				message: "Required when ENABLE_BOOTSTRAP is true",
			})
		}

		if (!val.BOOTSTRAP_ADMIN_PASSWORD) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["BOOTSTRAP_ADMIN_PASSWORD"],
				message: "Required when ENABLE_BOOTSTRAP is true",
			})
		}
	})

function validateEnv() {
	const parsed = envSchema.safeParse(process.env)

	if (!parsed.success) {
		console.error("Invalid environment variables:")

		parsed.error.issues.forEach(issue => {
			console.error(`  ${issue.path.join(".")}: ${issue.message}`)
		})

		// Fail fast — app should not run with invalid config
		throw new Error("Invalid environment variables")
	}

	return parsed.data
}
export const env = validateEnv()
