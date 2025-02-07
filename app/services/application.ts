import { db } from "@/lib/db";
import { generateKeyPair, hashApiKey } from "@/lib/key-generator";
import { Application, ApplicationApiKey } from "@/core/types/application";
import crypto from 'crypto';

export const createApplication = async (
  name: string,
  description: string | null,
  developer_id: string
): Promise<(Application & { secretKey: string }) | null> => {
  try {
    const { secretKey, publicKey } = generateKeyPair();
    const hashedSecret = hashApiKey(secretKey);

    const application = await db.application.create({
      data: {
        name,
        description,
        developer_id,
        ApplicationApiKey: {
          create: {
            public_key: publicKey,
            hashed_secret: hashedSecret,
          },
        },
      },
      include: {
        ApplicationApiKey: true,
      },
    });

    // Add the secret key to the returned object
    return {
      ...application,
      secretKey,
    };
  } catch (error) {
    console.error("Error in createApplication:", error);
    return null;
  }
};

export const getApplicationsByDeveloperId = async (developer_id: string): Promise<Application[] | null> => {
  try {
    const applications = await db.application.findMany({
      where: { developer_id },
      include: {
        ApplicationApiKey: true,
      },
    });
    return applications;
  } catch (error) {
    console.error("Error in getApplicationsByDeveloperId:", error);
    return null;
  }
};

export const getApplicationById = async (id: string): Promise<Application | null> => {
  try {
    const application = await db.application.findUnique({
      where: { id },
      include: {
        ApplicationApiKey: true,
      },
    });
    return application;
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    return null;
  }
};

export const verifyApiKeyAndGetApplication = async (publicKey: string, secretKey: string): Promise<Application | null> => {
  try {
    const apiKey = await db.applicationApiKey.findUnique({
      where: { public_key: publicKey },
      include: { application: true },
    });

    if (!apiKey) {
      throw new Error('Invalid API key');
    }

    const hashedSecret = crypto.createHash('sha256').update(secretKey).digest('hex');

    if (hashedSecret !== apiKey.hashed_secret) {
      throw new Error('Invalid API secret');
    }

    // Update last_used timestamp
    await db.applicationApiKey.update({
      where: { id: apiKey.id },
      data: { last_used: new Date() },
    });

    return {
      ...apiKey.application,
      ApplicationApiKey: [apiKey]
    };
  } catch (error) {
    console.error("Error in verifyApiKeyAndGetApplication:", error);
    return null;
  }
};

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

export const verifyApiKey = async (publicKey: string, secretKey: string): Promise<boolean> => {
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

