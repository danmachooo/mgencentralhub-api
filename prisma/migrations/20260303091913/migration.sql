/*
  Warnings:

  - You are about to drop the `ChatbotMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatbotMessage" DROP CONSTRAINT "ChatbotMessage_userId_fkey";

-- DropTable
DROP TABLE "ChatbotMessage";

-- CreateTable
CREATE TABLE "chatbot_message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chatbot_message" ADD CONSTRAINT "chatbot_message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
