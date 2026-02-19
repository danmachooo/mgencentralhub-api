// src/server.ts
import { app } from "@/app"
import { logger } from "@/lib"
import { appConfig } from "@/config/appConfig"

const PORT = appConfig.app.port

app.listen(PORT, () => {
	logger.info(`Microgenesis Central Hub API running on port ${PORT}`)
})
