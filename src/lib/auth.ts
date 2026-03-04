import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"
import { appConfig } from "@/config/appConfig"

const backendURL = appConfig.app.url
const frontendURL = appConfig.frontend.url
const betterAuthUrl = appConfig.auth.url

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	baseURL: betterAuthUrl,
	trustedOrigins: [backendURL, frontendURL],
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
		}
	},
})
