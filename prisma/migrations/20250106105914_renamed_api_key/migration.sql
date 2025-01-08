/*
  Warnings:

  - You are about to drop the `DeveloperApiKey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `ApplicationUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeveloperApiKey" DROP CONSTRAINT "DeveloperApiKey_developer_id_fkey";

-- AlterTable
ALTER TABLE "ApplicationUser" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "DeveloperApiKey";

-- CreateTable
CREATE TABLE "ApplicationApiKey" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "hashed_secret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationApiKey_public_key_key" ON "ApplicationApiKey"("public_key");

-- CreateIndex
CREATE INDEX "ApplicationApiKey_public_key_idx" ON "ApplicationApiKey"("public_key");

-- AddForeignKey
ALTER TABLE "ApplicationApiKey" ADD CONSTRAINT "ApplicationApiKey_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
