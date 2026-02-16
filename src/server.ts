// src/server.ts
import app from "./app"
import Logger from "./lib/logger"
import { appConfig } from "./config/appConfig"

const PORT = appConfig.app.port

app.listen(PORT, () => {
	Logger.info(`Microgenesis Central Hub API running on port ${PORT}`)
})
