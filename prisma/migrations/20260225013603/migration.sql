/*
  Warnings:

  - You are about to drop the column `status` on the `personal_systems` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `systems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusId` to the `systems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "systems_status_idx";

-- DropIndex
DROP INDEX "user_profiles_role_idx";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "personal_systems" DROP COLUMN "status",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "systems" DROP COLUMN "status",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "statusId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "role",
ADD COLUMN     "role_id" UUID NOT NULL;

-- DropEnum
DROP TYPE "PersonalSystemStatus";

-- DropEnum
DROP TYPE "SystemStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_flags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "system_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_roles_deletedAt_idx" ON "user_roles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_name_key" ON "user_roles"("name");

-- CreateIndex
CREATE INDEX "system_flags_deletedAt_idx" ON "system_flags"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_flags_name_key" ON "system_flags"("name");

-- CreateIndex
CREATE INDEX "departments_deletedAt_idx" ON "departments"("deletedAt");

-- CreateIndex
CREATE INDEX "personal_systems_deletedAt_idx" ON "personal_systems"("deletedAt");

-- CreateIndex
CREATE INDEX "systems_statusId_idx" ON "systems"("statusId");

-- CreateIndex
CREATE INDEX "systems_deletedAt_idx" ON "systems"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "systems_name_key" ON "systems"("name");

-- CreateIndex
CREATE INDEX "user_profiles_role_id_idx" ON "user_profiles"("role_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "systems" ADD CONSTRAINT "systems_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "system_flags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
