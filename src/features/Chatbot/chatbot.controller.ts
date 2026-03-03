import { chatWithGemini } from "@/features/Chatbot/chatbot.service";
import { asyncHandler } from "@/middlewares";
import { promptSchema } from "@/schema";
import { HttpContext } from "@/types/shared";








export const chatbotHandler = asyncHandler( async (http: HttpContext) => {
    const prompt = promptSchema.parse(http.req.body);

    const response = await chatWithGemini(prompt.message);

    return http.res.status(200).json({
        success: true,
        message: response
    })
})