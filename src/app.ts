import express from "express"
import cors from "cors"
import helmet from "helmet"
import { toNodeHandler } from "better-auth/node"
import { auth } from "@/lib"
import routes from "@/routes"
import { errorHandler, notFoundHandler, rateLimit } from "@/middlewares"
import { appConfig } from "@/config/app-config"
import path from "path"

const frontendURL = appConfig.frontend.url
const backendURL = appConfig.app.url
const storageMode = appConfig.storage.mode

const app = express()

app.set("trust proxy", 1) // REQUIRED BEHIND RENDER / CLOUDFLARE

// Define cors
app.use(
	cors({
		origin: [frontendURL, backendURL],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
)

// Define Helmet
app.use(helmet({
	contentSecurityPolicy: false,
	crossOriginEmbedderPolicy: false
}))



// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (storageMode !== "supabase") {
	app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
}

// Routes
app.get("/", (_, res) => {
	return res.status(200).json({
		success: true,
		message: "I am running :))",
	})
})
app.use("/api/auth", toNodeHandler(auth))

app.use("/api", routes)

// route not found handler
app.use(notFoundHandler)

// global errorhandler
app.use(errorHandler)

export { app }
