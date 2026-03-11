/*
  Warnings:

  - A unique constraint covering the columns `[owner_user_id,name]` on the table `personal_systems` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `personal_systems` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "personal_systems_owner_user_id_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "personal_systems_owner_user_id_name_key" ON "personal_systems"("owner_user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "personal_systems_url_key" ON "personal_systems"("url");
