import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import { auth } from "@/lib"
import routes from "@/routes"
import { errorHandler, notFoundHandler } from "@/middlewares"
import { appConfig } from "@/config/appConfig"

const app = express()

const frontendURL = appConfig.frontend.url

// Define cors
app.use(
	cors({
		origin: frontendURL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
)

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/", (_, res) => {
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
