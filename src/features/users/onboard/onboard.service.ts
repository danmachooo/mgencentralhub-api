import { updateOnboard, getOnboard } from "@/features/users/onboard/onboard.repo";
import {  getUserRecord } from "@/features/users/profile/user-profile.service";
import { PrismaErrorHandler } from "@/helpers/prisma";
import { logger } from "@/lib";
import { UserIdentifier } from "@/schema";

const withOnboardErrors = new PrismaErrorHandler({
    entity: "User"
})

type Action = "get" | "set"

export async function onBoardOrchestrator(action: Action, user: UserIdentifier) {
    const ctx = await getUserRecord(user);

    return withOnboardErrors.exec(async () => {

        switch(action) {
            case "get":
                return await getOnboard(ctx.id);
            case "set":
                return updateOnboard(ctx.id)
            default:
                logger.error("Invalid Action.", {
                    action
                })
                return
        }
    })
}