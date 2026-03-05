import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"
import { appConfig } from "@/config/app-config"
import { redis } from "@/lib/redis"

const backendURL = appConfig.app.url
const frontendURL = appConfig.frontend.url
const betterAuthUrl = appConfig.auth.url

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	baseURL: betterAuthUrl,
	trustedOrigins: [backendURL, frontendURL],

	secondaryStorage: {
		get: async (key) => {
			return await redis.get(key)
		},
		set: async (key, value, ttl) => {
			ttl ? await redis.set(key, value, {ex: ttl}) : await redis.set(key,value)
		},
		delete: async (key) => {
			await redis.del(key)
		}
	},

	advanced: {
		ipAddress: {
			ipv6Subnet: 64,
			ipAddressHeaders: ["x-forwared-for"]
		}
	},

	rateLimit: {
		enabled: appConfig.app.nodeEnv === "production",
		window: 60,
		max: 100

	},

	emailAndPassword: {
		enabled: true,
	},

	socialProviders: {
		microsoft: {
			clientId: appConfig.auth.azure.clientId,
			clientSecret: appConfig.auth.azure.clientSecret,
			tenantId: appConfig.auth.azure.tenantId,
			authority: "https://login.microsoftonline.com",
			prompt: "select_account",
		},
		google: {
			clientId: appConfig.auth.google.clientId,
			clientSecret: appConfig.auth.google.clientSecret,
			prompt: "select_account consent",
			accessType: "offline",
		},
	},
})
