// src/server.ts
import { app } from "@/app"
import { logger } from "@/lib"
import { appConfig } from "@/config/appConfig"
import { initializeModels } from "@/boot"

const PORT = appConfig.app.port

const startServer = async () => {
	await initializeModels()

	app.listen(PORT, () => {
		logger.info(`Microgenesis Central Hub API running on port ${PORT}`)
	})
}

void startServer()
