import { appConfig } from "@/config/appConfig";
import { Redis } from "@upstash/redis"

export const redis = new Redis({
    url: appConfig.redis.url,
    token: appConfig.redis.token
})