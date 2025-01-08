-- CreateTable
CREATE TABLE "DeveloperApiKey" (
    "id" TEXT NOT NULL,
    "developer_id" UUID NOT NULL,
    "public_key" TEXT NOT NULL,
    "hashed_secret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperApiKey_public_key_key" ON "DeveloperApiKey"("public_key");

-- CreateIndex
CREATE INDEX "DeveloperApiKey_public_key_idx" ON "DeveloperApiKey"("public_key");

-- AddForeignKey
ALTER TABLE "DeveloperApiKey" ADD CONSTRAINT "DeveloperApiKey_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "User"("gg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
