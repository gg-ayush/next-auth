import { db } from "@/lib/db";
import { generateKeyPair, hashApiKey } from "@/lib/key-generator";

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

