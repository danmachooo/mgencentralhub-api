-- CreateEnum
CREATE TYPE "ChatbotMessageRole" AS ENUM ('user', 'assistant');

-- Convert role column from TEXT -> enum with safe normalization
ALTER TABLE "chatbot_message"
ALTER COLUMN "role" TYPE "ChatbotMessageRole"
USING (
	CASE
		WHEN lower("role") = 'assistant' THEN 'assistant'::"ChatbotMessageRole"
		ELSE 'user'::"ChatbotMessageRole"
	END
);

-- Improve conversation read patterns
CREATE INDEX "chatbot_message_userId_createdAt_idx" ON "chatbot_message"("userId", "createdAt");
CREATE INDEX "chatbot_message_createdAt_idx" ON "chatbot_message"("createdAt");

-- Align with other user-owned relations to avoid dangling references
ALTER TABLE "chatbot_message" DROP CONSTRAINT "chatbot_message_userId_fkey";
ALTER TABLE "chatbot_message"
ADD CONSTRAINT "chatbot_message_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
