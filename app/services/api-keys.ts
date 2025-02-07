import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateKeyPair, hashApiKey } from "@/lib/key-generator";
import crypto from "crypto";

export const regenerateApiKey = async (applicationId: string) => {
  try {
    // First, find the existing API key for the application
    const existingApiKey = await db.applicationApiKey.findFirst({
      where: { application_id: applicationId },
    });

    if (!existingApiKey) {
      throw new Error("No API key found for this application");
    }

    const { secretKey, publicKey } = generateKeyPair();
    const hashedSecret = hashApiKey(secretKey);

    // Update the existing API key
    const updatedApiKey = await db.applicationApiKey.update({
      where: { id: existingApiKey.id },
      data: {
        public_key: publicKey,
        hashed_secret: hashedSecret,
      },
    });

    return { ...updatedApiKey, secret_key: secretKey };
  } catch (error) {
    console.error("Error in regenerateApiKey:", error);
    return null;
  }
};

export const verifyApiKey = async (publicKey: string, secretKey: string) => {
  try {
    const apiKey = await db.applicationApiKey.findUnique({
      where: { public_key: publicKey },
    });

    if (!apiKey) {
      return false;
    }

    const hashedSecret = hashApiKey(secretKey);
    return apiKey.hashed_secret === hashedSecret;
  } catch (error) {
    console.error("Error in verifyApiKey:", error);
    return false;
  }
};

export async function getApplicationApiKeys(applicationId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const apiKeys = await db.applicationApiKey.findMany({
      where: { application_id: applicationId },
      select: {
        id: true,
        public_key: true,
        last_used: true,
        created_at: true,
      },
    })
    return { success: true, data: apiKeys }
  } catch (error) {
    console.error("Failed to fetch API keys:", error)
    return { success: false, error: "Failed to fetch API keys" }
  }
}

export async function generateNewApiKey(applicationId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const publicKey = crypto.randomBytes(16).toString("hex")
    const secretKey = crypto.randomBytes(32).toString("hex")
    const hashedSecret = crypto.createHash("sha256").update(secretKey).digest("hex")

    const newApiKey = await db.applicationApiKey.create({
      data: {
        application_id: applicationId,
        public_key: publicKey,
        hashed_secret: hashedSecret,
      },
    })

    return {
      success: true,
      data: {
        id: newApiKey.id,
        public_key: newApiKey.public_key,
        secret_key: secretKey, // This is the only time we'll have access to the unhashed secret
        created_at: newApiKey.created_at,
      },
    }
  } catch (error) {
    console.error("Failed to generate new API key:", error)
    return { success: false, error: "Failed to generate new API key" }
  }
}
