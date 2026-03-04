import { appConfig } from "@/config/app-config"
import { Redis } from "@upstash/redis"

export const redis = new Redis({
	url: appConfig.redis.url,
	token: appConfig.redis.token,
})
