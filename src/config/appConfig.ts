import { env } from "./env"

export const appConfig = {
	/**
	 * Core application settings.
	 */
	app: {
		/** Port the HTTP server listens on */
		port: env.PORT,

		/** Public base URL of the application */
		url: env.BASE_URL,

		/** Current runtime environment (development | production | test) */
		nodeEnv: env.NODE_ENV,
	},
	/**
	 * Database configuration.
	 */
	database: {
		/** Database connection URL */
		url: env.DATABASE_URL,
	},

	/**
	 * Authentication and OAuth configuration.
	 */
	auth: {
		/** Secret used by Better Auth for signing tokens */
		secret: env.BETTER_AUTH_SECRET,

		/** Public URL used by Better Auth */
		url: env.BETTER_AUTH_URL,

		/**
		 * Azure SSO credentials.
		 */
		azure: {
			clientId: env.AZURE_AD_CLIENT_ID,
			clientSecret: env.AZURE_AD_CLIENT_SECRET,
			tenantId: env.AZURE_AD_TENANT_ID,
			redirectUri: env.AZURE_AD_REDIRECT_URI,
		},
	},
	frontend: {
		url: env.FRONTEND_URL,
	},
} as const
